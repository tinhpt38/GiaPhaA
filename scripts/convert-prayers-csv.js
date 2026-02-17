const fs = require('fs');
const path = require('path');

// Đọc file CSV
const csvPath = path.join(__dirname, '../van_khan_tuc.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV thủ công để xử lý multiline content
function parseCSV(content) {
    const lines = content.split('\n');
    const result = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let lineIndex = 0;

    // Skip header
    let i = content.indexOf('\n') + 1;

    while (i < content.length) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i += 2;
                continue;
            } else {
                // Toggle quote mode
                inQuotes = !inQuotes;
                i++;
                continue;
            }
        }

        if (!inQuotes && char === ',') {
            // Field separator
            currentRow.push(currentField.trim());
            currentField = '';
            i++;
            continue;
        }

        if (!inQuotes && (char === '\n' || char === '\r')) {
            // End of row
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField.trim());

                if (currentRow.length >= 4) {
                    const sttStr = currentRow[0].replace(/"/g, '').trim();
                    const stt = sttStr ? parseInt(sttStr) : null;

                    result.push({
                        stt: isNaN(stt) ? null : stt,
                        title: currentRow[1].replace(/^"|"$/g, '').trim(),
                        category: currentRow[2].replace(/^"|"$/g, '').trim(),
                        content: currentRow[3].replace(/^"|"$/g, '').replace(/\\n/g, '\n').trim()
                    });
                }

                currentRow = [];
                currentField = '';
            }
            i++;
            continue;
        }

        currentField += char;
        i++;
    }

    // Handle last row
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.length >= 4) {
            const sttStr = currentRow[0].replace(/"/g, '').trim();
            const stt = sttStr ? parseInt(sttStr) : null;

            result.push({
                stt: isNaN(stt) ? null : stt,
                title: currentRow[1].replace(/^"|"$/g, '').trim(),
                category: currentRow[2].replace(/^"|"$/g, '').trim(),
                content: currentRow[3].replace(/^"|"$/g, '').replace(/\\n/g, '\n').trim()
            });
        }
    }

    return result.filter(row => row.stt !== null && row.title && row.content);
}

const prayers = parseCSV(csvContent);

// Ghi ra file JSON
const jsonPath = path.join(__dirname, '../src/data/prayers.json');
const dataDir = path.join(__dirname, '../src/data');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(jsonPath, JSON.stringify(prayers, null, 2), 'utf-8');

console.log(`✅ Đã chuyển đổi ${prayers.length} bài văn khấn từ CSV sang JSON`);
console.log(`📁 File được lưu tại: ${jsonPath}`);

// In ra một vài mẫu để kiểm tra
if (prayers.length > 0) {
    console.log('\n📝 Mẫu bài văn khấn đầu tiên:');
    console.log('STT:', prayers[0].stt);
    console.log('Title:', prayers[0].title);
    console.log('Category:', prayers[0].category);
    console.log('Content length:', prayers[0].content.length, 'characters');
    console.log('Content preview:', prayers[0].content.substring(0, 100) + '...');
}
