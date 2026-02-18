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


-- ==========================================
--  COMMUNITY FEATURES (Up-vote & Public)
-- ==========================================

-- 1. Update trees table
alter table trees add column if not exists is_public boolean default false;
alter table trees add column if not exists view_count bigint default 0;

-- 2. Create tree_votes table
create table if not exists tree_votes (
  id uuid default gen_random_uuid() primary key,
  tree_id uuid references trees(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade,         -- Nullable for anonymous
  anonymous_identifier text,                                      -- Nullable for logged-in
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one vote per user OR per device (anonymous)
  -- constraint unique_vote_user unique nulls not distinct (tree_id, user_id),
  -- constraint unique_vote_anon unique nulls not distinct (tree_id, anonymous_identifier),
  
  -- Ensure at least one identifier is present
  constraint check_voter check (
    (user_id is not null and anonymous_identifier is null) or 
    (user_id is null and anonymous_identifier is not null)
  )
  )
);

-- Create partial unique indexes to allow multiple NULLs (for anonymous votes vs logged in votes)
create unique index if not exists idx_tree_votes_user on tree_votes (tree_id, user_id) where user_id is not null;
create unique index if not exists idx_tree_votes_anon on tree_votes (tree_id, anonymous_identifier) where anonymous_identifier is not null;

-- RLS for tree_votes
alter table tree_votes enable row level security;

create policy "Anyone can view votes" on tree_votes
  for select using (true);

create policy "Anyone can insert votes" on tree_votes
  for insert with check (true);
  
create policy "Users can delete their own votes" on tree_votes
  for delete using (
    (auth.uid() = user_id) or 
    (anonymous_identifier is not null) -- Conceptual allow, logic handled in RPC/App
  );


-- 3. Functions

-- Increment View Count
create or replace function increment_tree_view(tree_uuid uuid)
returns void as $$
begin
  update trees
  set view_count = view_count + 1
  where id = tree_uuid;
end;
$$ language plpgsql security definer;

-- Vote Tree (Upsert-like logic handled by App or simple insert with error handling)
-- Actually, let's make a safe vote function to handle the unique constraint gracefully or just let the app handle 409
create or replace function toggle_tree_vote(
  _tree_id uuid,
  _user_id uuid default null,
  _anon_id text default null
)
returns jsonb as $$
declare
  vote_exists boolean;
begin
  -- Check if vote exists
  if _user_id is not null then
    select exists(select 1 from tree_votes where tree_id = _tree_id and user_id = _user_id) into vote_exists;
    
    if vote_exists then
      delete from tree_votes where tree_id = _tree_id and user_id = _user_id;
      return jsonb_build_object('status', 'unvoted');
    else
      insert into tree_votes (tree_id, user_id) values (_tree_id, _user_id);
      return jsonb_build_object('status', 'voted');
    end if;
    
  elsif _anon_id is not null then
    select exists(select 1 from tree_votes where tree_id = _tree_id and anonymous_identifier = _anon_id) into vote_exists;
    
    if vote_exists then
      delete from tree_votes where tree_id = _tree_id and anonymous_identifier = _anon_id;
      return jsonb_build_object('status', 'unvoted');
    else
      insert into tree_votes (tree_id, anonymous_identifier) values (_tree_id, _anon_id);
      return jsonb_build_object('status', 'voted');
    end if;
  else
    raise exception 'Must provide user_id or anonymous_identifier';
  end if;
end;
$$ language plpgsql security definer;

-- Get Tree Stats
create or replace function get_tree_stats(tree_uuid uuid)
returns jsonb as $$
declare
  _view_count bigint;
  _vote_count bigint;
begin
  select view_count into _view_count from trees where id = tree_uuid;
  select count(*) into _vote_count from tree_votes where tree_id = tree_uuid;
  
  return jsonb_build_object(
    'view_count', coalesce(_view_count, 0),
    'vote_count', _vote_count
  );
end;
$$ language plpgsql security definer;
