
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';

const TREE_ID = '39edbd8a-4663-4226-aefd-c4ecb410fb71';
const MAX_GENERATION = 9;
const START_YEAR = 1750;
const GENERATION_GAP = 25;

const FAMILY_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const MIDDLE_NAMES_MALE = ['Văn', 'Hữu', 'Đức', 'Công', 'Quang', 'Minh', 'Thành', 'Gia', 'Bảo', 'Hoàng'];
const MIDDLE_NAMES_FEMALE = ['Thị', 'Thu', 'Thanh', 'Ngọc', 'Mai', 'Lan', 'Hương', 'Huyền', 'Phương', 'Thảo'];
const FIRST_NAMES_MALE = ['Hùng', 'Cường', 'Dũng', 'Nam', 'Bắc', 'Tùng', 'Sơn', 'Hải', 'Phong', 'Lâm', 'Thắng', 'Lợi', 'Quân', 'Kiệt', 'Thịnh', 'Phát'];
const FIRST_NAMES_FEMALE = ['Hoa', 'Huệ', 'Lan', 'Mai', 'Cúc', 'Trúc', 'Quỳnh', 'Trang', 'Nhung', 'Gấm', 'Vân', 'Anh', 'Hà', 'Thủy', 'Thảo', 'Hiền'];

function getRandomElement(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(gender: 'male' | 'female'): string {
    const family = getRandomElement(FAMILY_NAMES);
    const middle = gender === 'male' ? getRandomElement(MIDDLE_NAMES_MALE) : getRandomElement(MIDDLE_NAMES_FEMALE);
    const first = gender === 'male' ? getRandomElement(FIRST_NAMES_MALE) : getRandomElement(FIRST_NAMES_FEMALE);
    return `${family} ${middle} ${first}`;
}

let sql = `-- Sample Data for Tree ID: ${TREE_ID}
-- Generated automatically
-- Clears existing data for this tree first (optional, comment out if needed)
DELETE FROM members WHERE tree_id = '${TREE_ID}';

`;

function formatDate(year: number) {
    // Random day/month
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function createMember(generation: number, parentId: string | null, gender: 'male' | 'female' = 'male'): string {
    const id = randomUUID();
    const name = generateName(gender);
    const dobYear = START_YEAR + (generation - 1) * GENERATION_GAP + Math.floor(Math.random() * 10);
    const isAlive = dobYear > 1940 ? true : false; // Rough estimate
    const relationship = generation === 1 ? 'root' : 'child';

    // Additional fields
    const nickname = Math.random() > 0.7 ? `Tự ${name.split(' ').pop()}` : null;
    const job = generation > 5 ? (Math.random() > 0.5 ? 'Nông dân' : 'Buôn bán') : 'Quan viên';

    // Build INSERT statement
    // Note: We use the consolidated fields from migration_v3 (generation, etc.)
    let insert = `INSERT INTO members (
    id, tree_id, full_name, gender, relationship, parent_id, is_alive, 
    dob_solar_year, dob_solar, generation, nickname, job
) VALUES (
    '${id}', 
    '${TREE_ID}', 
    '${name}', 
    '${gender}', 
    '${relationship}', 
    ${parentId ? `'${parentId}'` : 'NULL'}, 
    ${isAlive}, 
    ${dobYear}, 
    '${formatDate(dobYear)}', 
    ${generation},
    ${nickname ? `'${nickname}'` : 'NULL'},
    '${job}'
);\n`;

    sql += insert;

    // Add Spouse? (Only for males, simplifying)
    if (gender === 'male' && Math.random() > 0.3) {
        const spouseId = randomUUID();
        const spouseName = generateName('female');
        const spouseDobYear = dobYear + Math.floor(Math.random() * 5) - 2;

        // Insert spouse linked to this member
        let spouseInsert = `INSERT INTO members (
    id, tree_id, full_name, gender, relationship, spouse_id, is_alive,
    dob_solar_year, dob_solar, generation, spouse_name
) VALUES (
    '${spouseId}',
    '${TREE_ID}',
    '${spouseName}',
    'female',
    'spouse',
    '${id}',
    ${isAlive},
    ${spouseDobYear},
    '${formatDate(spouseDobYear)}',
    ${generation},
    '${name}' -- Set spouse name to husband's name for reference
);\n`;
        sql += spouseInsert;

        // Update husband with spouse_id
        sql += `UPDATE members SET spouse_id = '${spouseId}' WHERE id = '${id}';\n`;
    }

    // Recursion for children
    if (generation < MAX_GENERATION) {
        // Number of children: 0 to 4
        // Decrease probability of large families at deeper levels to control size
        const numChildren = Math.floor(Math.random() * (generation < 4 ? 4 : 3));

        for (let i = 0; i < numChildren; i++) {
            // Skew towards male children for traditional lineage continuity simulation? 
            // Or roughly 50/50.
            const childGender = Math.random() > 0.5 ? 'male' : 'female';
            createMember(generation + 1, id, childGender);
        }
    }

    return id;
}

// Start with Root (Generation 1)
createMember(1, null, 'male');

fs.writeFileSync('supabase/seed_large_tree_data.sql', sql);
console.log('Generated supabase/seed_large_tree_data.sql');
