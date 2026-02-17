-- Add coordinate fields to members table
alter table members 
add column if not exists coordinate_x double precision,
add column if not exists coordinate_y double precision;
