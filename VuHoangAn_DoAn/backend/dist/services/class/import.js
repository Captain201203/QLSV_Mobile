import fs from 'fs/promises';
import * as XLSX from 'xlsx';
import ClassModel from '../../models/class/model.js';
async function parseExcel(filePath) {
    const buf = await fs.readFile(filePath);
    const wb = XLSX.read(buf, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    return rows;
}
function normalizeAndValidate(rows) {
    const valid = [];
    const errors = [];
    rows.forEach((r, idx) => {
        const rowIndex = idx + 2; // +2 vì header ở dòng 1
        const classId = String(r.classId || '').trim();
        const className = String(r.className || '').trim();
        const department = String(r.department || '').trim();
        if (!classId || !className || !department) {
            errors.push({ row: rowIndex, reason: 'Thiếu trường bắt buộc (classId, className hoặc department)' });
            return;
        }
        valid.push({ classId, className, department });
    });
    return { valid, errors };
}
async function upsertClasses(data) {
    if (data.length === 0)
        return { upserted: 0, matchedUpdated: 0 };
    const ops = data.map((d) => ({
        updateOne: {
            filter: { classId: d.classId },
            update: {
                $set: {
                    className: d.className,
                    department: d.department,
                },
            },
            upsert: true,
        },
    }));
    const result = await ClassModel.bulkWrite(ops, { ordered: false });
    const upserted = result.upsertedCount || 0;
    const matchedUpdated = (result.modifiedCount || 0) + (result.matchedCount || 0) - upserted;
    return { upserted, matchedUpdated };
}
const ClassImportService = {
    async importFromExcel(filePath) {
        let rows = [];
        try {
            rows = await parseExcel(filePath);
            if (rows.length === 0) {
                throw new Error('File không có dữ liệu');
            }
            const { valid, errors } = normalizeAndValidate(rows);
            const writeRes = await upsertClasses(valid);
            return {
                totalRows: rows.length,
                valid: valid.length,
                errors,
                upserted: writeRes.upserted,
                matchedUpdated: writeRes.matchedUpdated,
            };
        }
        finally {
            // Dọn file tạm
            try {
                await fs.unlink(filePath);
            }
            catch { }
        }
    },
};
export default ClassImportService;
//# sourceMappingURL=import.js.map