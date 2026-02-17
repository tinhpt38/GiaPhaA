-- Sample Data for Tree ID: 39edbd8a-4663-4226-aefd-c4ecb410fb71
-- Generated automatically
-- Clears existing data for this tree first (optional, comment out if needed)
DELETE FROM members WHERE tree_id = '39edbd8a-4663-4226-aefd-c4ecb410fb71';

INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'bc1ce9a7-fc39-4cde-863b-6daf3d637ed6', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Dương Minh Lợi', 
    'male', 
    'root', 
    NULL, 
    false, 
    1752, 
    '1752-11-14', 
    1,
    'Tự Lợi',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '7699989a-66ba-4d20-b1cd-dc53c10827b8',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Trần Thanh Thảo',
    'female',
    'spouse',
    'bc1ce9a7-fc39-4cde-863b-6daf3d637ed6',
    false,
    1753,
    '1753-03-03',
    1,
    'Dương Minh Lợi' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '7699989a-66ba-4d20-b1cd-dc53c10827b8' WHERE id = 'bc1ce9a7-fc39-4cde-863b-6daf3d637ed6';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '5aa99df6-886f-449c-ba0d-3a71bafc7267', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Lê Hoàng Dũng', 
    'male', 
    'child', 
    'bc1ce9a7-fc39-4cde-863b-6daf3d637ed6', 
    false, 
    1779, 
    '1779-08-04', 
    2,
    'Tự Dũng',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    'e740c0de-b6f0-4641-89d9-2bbceb3b670b',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Bùi Lan Trang',
    'female',
    'spouse',
    '5aa99df6-886f-449c-ba0d-3a71bafc7267',
    false,
    1779,
    '1779-08-15',
    2,
    'Lê Hoàng Dũng' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = 'e740c0de-b6f0-4641-89d9-2bbceb3b670b' WHERE id = '5aa99df6-886f-449c-ba0d-3a71bafc7267';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'ddc78985-c4c7-4244-8bda-4a878c2000d2', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Lê Đức Quân', 
    'male', 
    'child', 
    '5aa99df6-886f-449c-ba0d-3a71bafc7267', 
    false, 
    1808, 
    '1808-03-26', 
    3,
    'Tự Quân',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '88d7e6a2-948f-4182-9986-48355fa8b916',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Đỗ Huyền Thủy',
    'female',
    'spouse',
    'ddc78985-c4c7-4244-8bda-4a878c2000d2',
    false,
    1810,
    '1810-04-05',
    3,
    'Lê Đức Quân' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '88d7e6a2-948f-4182-9986-48355fa8b916' WHERE id = 'ddc78985-c4c7-4244-8bda-4a878c2000d2';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '9fceb994-c9a2-466e-84da-3bd75dd0491d', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Hồ Minh Thịnh', 
    'male', 
    'child', 
    'ddc78985-c4c7-4244-8bda-4a878c2000d2', 
    false, 
    1831, 
    '1831-07-15', 
    4,
    NULL,
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    'd8c947be-1a16-42e4-ad69-a3f7f289102e',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Nguyễn Thảo Hoa',
    'female',
    'spouse',
    '9fceb994-c9a2-466e-84da-3bd75dd0491d',
    false,
    1832,
    '1832-08-22',
    4,
    'Hồ Minh Thịnh' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = 'd8c947be-1a16-42e4-ad69-a3f7f289102e' WHERE id = '9fceb994-c9a2-466e-84da-3bd75dd0491d';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'cbdb0169-5b97-40e4-8ebf-601f47e19dcb', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Lê Huyền Mai', 
    'female', 
    'child', 
    'ddc78985-c4c7-4244-8bda-4a878c2000d2', 
    false, 
    1832, 
    '1832-12-15', 
    4,
    'Tự Mai',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '12c995b0-0c0e-4277-aba4-8274ee7d75d0', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Dương Thu Hiền', 
    'female', 
    'child', 
    'cbdb0169-5b97-40e4-8ebf-601f47e19dcb', 
    false, 
    1850, 
    '1850-06-08', 
    5,
    'Tự Hiền',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '58f6eb19-14ec-4df2-af7a-467b9c608f58', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Hồ Văn Nam', 
    'male', 
    'child', 
    '12c995b0-0c0e-4277-aba4-8274ee7d75d0', 
    false, 
    1881, 
    '1881-01-16', 
    6,
    NULL,
    'Nông dân'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '8a68370a-71f3-4b28-8016-13c5201f4ae6',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Ngô Mai Thảo',
    'female',
    'spouse',
    '58f6eb19-14ec-4df2-af7a-467b9c608f58',
    false,
    1882,
    '1882-04-05',
    6,
    'Hồ Văn Nam' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '8a68370a-71f3-4b28-8016-13c5201f4ae6' WHERE id = '58f6eb19-14ec-4df2-af7a-467b9c608f58';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '7fbb9ec0-f047-416b-af52-47c57981f2b3', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Hồ Minh Dũng', 
    'male', 
    'child', 
    '58f6eb19-14ec-4df2-af7a-467b9c608f58', 
    false, 
    1903, 
    '1903-06-04', 
    7,
    NULL,
    'Buôn bán'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '4fcbc84d-a5ec-48cd-a173-08fda0721e18',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Bùi Thu Lan',
    'female',
    'spouse',
    '7fbb9ec0-f047-416b-af52-47c57981f2b3',
    false,
    1901,
    '1901-10-28',
    7,
    'Hồ Minh Dũng' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '4fcbc84d-a5ec-48cd-a173-08fda0721e18' WHERE id = '7fbb9ec0-f047-416b-af52-47c57981f2b3';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '55feb19e-e153-4a51-b68b-cbad5fa9a8ce', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Lê Mai Trúc', 
    'female', 
    'child', 
    '7fbb9ec0-f047-416b-af52-47c57981f2b3', 
    false, 
    1928, 
    '1928-05-01', 
    8,
    'Tự Trúc',
    'Buôn bán'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '62f51634-2acb-4e52-b9ac-9ee257b6669a', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Bùi Đức Kiệt', 
    'male', 
    'child', 
    '55feb19e-e153-4a51-b68b-cbad5fa9a8ce', 
    true, 
    1951, 
    '1951-01-12', 
    9,
    'Tự Kiệt',
    'Nông dân'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '86cdbea2-235e-4292-8129-0ccdd2dba3e4',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Trần Hương Hoa',
    'female',
    'spouse',
    '62f51634-2acb-4e52-b9ac-9ee257b6669a',
    true,
    1950,
    '1950-10-10',
    9,
    'Bùi Đức Kiệt' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '86cdbea2-235e-4292-8129-0ccdd2dba3e4' WHERE id = '62f51634-2acb-4e52-b9ac-9ee257b6669a';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '8db3e845-bb12-4564-966d-5f3436d4f9dd', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Phan Đức Tùng', 
    'male', 
    'child', 
    '7fbb9ec0-f047-416b-af52-47c57981f2b3', 
    false, 
    1928, 
    '1928-07-19', 
    8,
    'Tự Tùng',
    'Nông dân'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    'f2ea7641-2719-461b-9a64-64854166d90a',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Huỳnh Huyền Thảo',
    'female',
    'spouse',
    '8db3e845-bb12-4564-966d-5f3436d4f9dd',
    false,
    1929,
    '1929-02-08',
    8,
    'Phan Đức Tùng' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = 'f2ea7641-2719-461b-9a64-64854166d90a' WHERE id = '8db3e845-bb12-4564-966d-5f3436d4f9dd';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '999b9ab3-6a41-4ee5-96c2-58d6cf5300a6', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Trần Hoàng Phong', 
    'male', 
    'child', 
    '8db3e845-bb12-4564-966d-5f3436d4f9dd', 
    true, 
    1959, 
    '1959-07-12', 
    9,
    NULL,
    'Nông dân'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '9c283d73-6061-4467-b7c3-618e10c18724',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Lê Thanh Anh',
    'female',
    'spouse',
    '999b9ab3-6a41-4ee5-96c2-58d6cf5300a6',
    true,
    1960,
    '1960-01-06',
    9,
    'Trần Hoàng Phong' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '9c283d73-6061-4467-b7c3-618e10c18724' WHERE id = '999b9ab3-6a41-4ee5-96c2-58d6cf5300a6';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '2d597469-7d92-4867-b50a-654afd199da5', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Đặng Quang Lợi', 
    'male', 
    'child', 
    'cbdb0169-5b97-40e4-8ebf-601f47e19dcb', 
    false, 
    1853, 
    '1853-03-26', 
    5,
    NULL,
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    'd12ec354-6aed-474c-a7b8-8f62a85767b7',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Vũ Thị Quỳnh',
    'female',
    'spouse',
    '2d597469-7d92-4867-b50a-654afd199da5',
    false,
    1854,
    '1854-03-24',
    5,
    'Đặng Quang Lợi' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = 'd12ec354-6aed-474c-a7b8-8f62a85767b7' WHERE id = '2d597469-7d92-4867-b50a-654afd199da5';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'd6d1d0d6-dc59-45ab-b75e-370d2666bb09', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Hồ Phương Thảo', 
    'female', 
    'child', 
    '2d597469-7d92-4867-b50a-654afd199da5', 
    false, 
    1877, 
    '1877-04-27', 
    6,
    NULL,
    'Nông dân'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'd91fa817-71c5-495c-9d5a-bdd822038b37', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Trần Thảo Trúc', 
    'female', 
    'child', 
    'ddc78985-c4c7-4244-8bda-4a878c2000d2', 
    false, 
    1828, 
    '1828-06-02', 
    4,
    'Tự Trúc',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '852c6f8c-75de-4683-9ffb-2048767b55d2', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Võ Văn Phong', 
    'male', 
    'child', 
    'd91fa817-71c5-495c-9d5a-bdd822038b37', 
    false, 
    1857, 
    '1857-08-22', 
    5,
    NULL,
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    'ba00e00a-2a6c-4207-9453-61c17e21c12a',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Phạm Hương Mai',
    'female',
    'spouse',
    '852c6f8c-75de-4683-9ffb-2048767b55d2',
    false,
    1858,
    '1858-07-17',
    5,
    'Võ Văn Phong' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = 'ba00e00a-2a6c-4207-9453-61c17e21c12a' WHERE id = '852c6f8c-75de-4683-9ffb-2048767b55d2';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'c8a19cfa-f475-4791-b04d-23c6779d9a49', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Hồ Lan Lan', 
    'female', 
    'child', 
    '852c6f8c-75de-4683-9ffb-2048767b55d2', 
    false, 
    1880, 
    '1880-09-11', 
    6,
    NULL,
    'Nông dân'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '2439bb0f-6369-4285-a1cc-c10ac082ad56', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Phạm Ngọc Hà', 
    'female', 
    'child', 
    'c8a19cfa-f475-4791-b04d-23c6779d9a49', 
    false, 
    1904, 
    '1904-05-11', 
    7,
    'Tự Hà',
    'Buôn bán'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '1b4b13b1-45c8-41f3-9144-2eff047027f9', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Lê Bảo Lâm', 
    'male', 
    'child', 
    '852c6f8c-75de-4683-9ffb-2048767b55d2', 
    false, 
    1880, 
    '1880-04-22', 
    6,
    NULL,
    'Buôn bán'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '7aad5193-72b1-4400-8cf5-115e56e446e2',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Đặng Hương Hoa',
    'female',
    'spouse',
    '1b4b13b1-45c8-41f3-9144-2eff047027f9',
    false,
    1881,
    '1881-03-17',
    6,
    'Lê Bảo Lâm' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = '7aad5193-72b1-4400-8cf5-115e56e446e2' WHERE id = '1b4b13b1-45c8-41f3-9144-2eff047027f9';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '0d639f5d-5893-42a5-82db-79818c663667', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Lý Hữu Phát', 
    'male', 
    'child', 
    'd91fa817-71c5-495c-9d5a-bdd822038b37', 
    false, 
    1855, 
    '1855-04-19', 
    5,
    'Tự Phát',
    'Quan viên'
);
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    'e2fa1ec9-f46d-4054-b769-5026cf08b532',
    '39edbd8a-4663-4226-aefd-c4ecb410fb71',
    'Hồ Thảo Lan',
    'female',
    'spouse',
    '0d639f5d-5893-42a5-82db-79818c663667',
    false,
    1856,
    '1856-11-20',
    5,
    'Lý Hữu Phát' -- Set spouse name to husband's name for reference
);
UPDATE members SET spouse_id = 'e2fa1ec9-f46d-4054-b769-5026cf08b532' WHERE id = '0d639f5d-5893-42a5-82db-79818c663667';
INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    'c7afa15f-cf2e-47fc-8a99-19211febb662', 
    '39edbd8a-4663-4226-aefd-c4ecb410fb71', 
    'Đỗ Thảo Huệ', 
    'female', 
    'child', 
    '5aa99df6-886f-449c-ba0d-3a71bafc7267', 
    false, 
    1806, 
    '1806-05-07', 
    3,
    'Tự Huệ',
    'Quan viên'
);
