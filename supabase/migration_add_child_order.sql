-- Add child_order column to members table
alter table members 
add column if not exists child_order integer;
