-- Migration to add more fields to members table
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
add column if not exists marriage_date_solar date; -- Ngày kết hôn
