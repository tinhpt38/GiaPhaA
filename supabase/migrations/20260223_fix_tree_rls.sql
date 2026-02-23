-- Fix RLS policies to prevent unauthorized access to private trees and members

-- Drop the old permissive policies
drop policy if exists "Trees are viewable by everyone." on trees;
drop policy if exists "Members are viewable by everyone." on members;

-- Trees: Viewable if you are the owner OR if the tree is public
create policy "Trees are viewable by owner or if public" on trees
  for select using (auth.uid() = owner_id or is_public = true);

-- Members: Viewable if you own the corresponding tree OR if the tree is public
create policy "Members are viewable by owner or if public" on members
  for select using (
    auth.uid() in (select owner_id from trees where id = tree_id)
    or
    true in (select is_public from trees where id = tree_id)
  );
