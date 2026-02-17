-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  plan_tier text default 'hieu' check (plan_tier in ('hieu', 'dao')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for Family Trees (Gia Phả)
create table trees (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  cover_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for trees
alter table trees enable row level security;

create policy "Trees are viewable by everyone." on trees
  for select using (true);

create policy "Users can insert their own trees." on trees
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own trees." on trees
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own trees." on trees
  for delete using (auth.uid() = owner_id);


-- Trigger to enforce "Hiếu" plan limit (Max 2 trees)
create or replace function check_tree_limit()
returns trigger as $$
begin
  if (select count(*) from trees where owner_id = auth.uid()) >= 2 and 
     (select plan_tier from profiles where id = auth.uid()) = 'hieu' then
      raise exception 'Gói Hiếu chỉ được tạo tối đa 2 gia phả.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger enforce_tree_limit
before insert on trees
for each row execute procedure check_tree_limit();


-- Create a table for Members (Thành viên)
create table members (
  id uuid default gen_random_uuid() primary key,
  tree_id uuid references trees(id) on delete cascade not null,
  full_name text not null,
  gender text check (gender in ('male', 'female', 'other')),
  relationship text check (relationship in ('root', 'spouse', 'child')),
  parent_id uuid references members(id), -- Self-referencing FK
  spouse_id uuid references members(id), -- Self-referencing FK
  is_alive boolean default true,
  dob_solar date,
  dob_lunar jsonb, -- { day: 1, month: 1, year: 2000, isLeap: false }
  dod_solar date,
  info jsonb default '{}'::jsonb, -- Bio, burial, images etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for members
alter table members enable row level security;

create policy "Members are viewable by everyone." on members
  for select using (true);

-- Only tree owner can edit members
create policy "Tree owners can insert members." on members
  for insert with check (
    auth.uid() in (select owner_id from trees where id = tree_id)
  );

create policy "Tree owners can update members." on members
  for update using (
    auth.uid() in (select owner_id from trees where id = tree_id)
  );

create policy "Tree owners can delete members." on members
  for delete using (
    auth.uid() in (select owner_id from trees where id = tree_id)
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
