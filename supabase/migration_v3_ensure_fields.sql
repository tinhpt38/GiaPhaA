
-- Migration to add ALL fields that might be missing if migration_add_fields.sql was skipped
-- This includes fields from migration_add_fields.sql AND migration_v2_split_dates.sql
-- Using IF NOT EXISTS to be safe

alter table members 
add column if not exists nickname text, -- Tên tự
add column if not exists title text, -- Hiệu
add column if not exists posthumous_name text, -- Tên thụy
add column if not exists generation integer, -- Đời thứ mấy
add column if not exists burial_place text, -- An táng tại
add column if not exists job text, -- Nghề nghiệp
add column if not exists achievement text, -- Công danh, khoa bảng
add column if not exists residence text, -- Định cư
add column if not exists birth_place text, -- Sinh quán
add column if not exists father_name text, -- Con ông (nếu không có trong cây)
add column if not exists mother_name text, -- Con bà
add column if not exists spouse_name text, -- Tên vợ/chồng (text field dự phòng)
add column if not exists marriage_date_solar date; -- Ngày kết hôn (legacy field)

-- From v2 migration (re-running is fine due to IF NOT EXISTS)
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
