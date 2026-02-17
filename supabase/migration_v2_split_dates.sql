-- Add missing fields and split date fields for flexible date handling
alter table members 
add column if not exists image_url text, -- Ảnh đại diện
add column if not exists death_place text, -- Nơi mất (Tử tại)

-- Birth Date Split
add column if not exists dob_solar_day integer,
add column if not exists dob_solar_month integer,
add column if not exists dob_solar_year integer,
add column if not exists dob_lunar_day integer,
add column if not exists dob_lunar_month integer,
add column if not exists dob_lunar_year integer,

-- Death Date Split
add column if not exists dod_solar_day integer,
add column if not exists dod_solar_month integer,
add column if not exists dod_solar_year integer,
add column if not exists dod_lunar_day integer,
add column if not exists dod_lunar_month integer,
add column if not exists dod_lunar_year integer,

-- Marriage Date Split
add column if not exists marriage_date_solar_day integer,
add column if not exists marriage_date_solar_month integer,
add column if not exists marriage_date_solar_year integer,
add column if not exists marriage_date_lunar_day integer,
add column if not exists marriage_date_lunar_month integer,
add column if not exists marriage_date_lunar_year integer;
