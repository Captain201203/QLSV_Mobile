import fs from 'fs/promises';
import * as XLSX from 'xlsx';
import SubjectModel from '../../models/subject/model.js';
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
        const subjectId = String(r.subjectId || '').trim();
        const subjectName = String(r.subjectName || '').trim();
        const department = String(r.department || '').trim();
        const credits = Number(r.credits);
        const description = String(r.description || '').trim();
        if (!subjectId || !subjectName || !credits || !department) {
            errors.push({ row: rowIndex, reason: 'Thiếu trường bắt buộc (subjectId, subjectsName, credits hoặc description)' });
            return;
        }
        valid.push({ subjectId, subjectName, credits, department, description });
    });
    return { valid, errors };
}
async function upsertSubjects(data) {
    if (data.length === 0)
        return { upserted: 0, matchedUpdated: 0 };
    const ops = data.map((d) => ({
        updateOne: {
            filter: { subjectId: d.subjectId },
            update: {
                $set: {
                    subjectName: d.subjectName,
                    credits: d.credits,
                    department: d.department,
                    description: d.description,
                },
            },
            upsert: true,
        },
    }));
    const result = await SubjectModel.bulkWrite(ops, { ordered: false });
    const upserted = result.upsertedCount || 0;
    const matchedUpdated = (result.modifiedCount || 0) + (result.matchedCount || 0) - upserted;
    return { upserted, matchedUpdated };
}
const SubjectImportService = {
    async importFromExcel(filePath) {
        let rows = [];
        try {
            rows = await parseExcel(filePath);
            if (rows.length === 0) {
                throw new Error('File không có dữ liệu');
            }
            const { valid, errors } = normalizeAndValidate(rows);
            const writeRes = await upsertSubjects(valid);
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
export default SubjectImportService;
//# sourceMappingURL=import.js.map