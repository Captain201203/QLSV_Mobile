import fs from 'fs/promises';
import * as XLSX from 'xlsx';
import StudentModel from '../../models/student/model.js';
import ClassModel from '../../models/class/model.js';

type StudentRow = {
  studentId?: string;
  studentName?: string;
  dateOfBirth?: any;     // có thể là số serial excel hoặc chuỗi
  phoneNumber?: string;
  email?: string;
  className?: string;
};

type ValidStudent = {
  studentId: string;
  studentName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  className: string;
};

type RowError = { row: number; reason: string };

function excelDateToJSDate(v: any): Date | null {
  // Hỗ trợ cả serial và chuỗi ISO/locale
  if (typeof v === 'number') {
    // Excel serial date: tính từ 1899-12-30
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const ms = Math.round(v * 24 * 60 * 60 * 1000);
    return new Date(epoch.getTime() + ms);
  }
  if (typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

async function parseExcel(filePath: string): Promise<StudentRow[]> {
  const buf = await fs.readFile(filePath);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<StudentRow>(ws, { defval: '' });
  return rows;
}

function normalizeAndValidate(rows: StudentRow[]) {// Chuẩn hóa và validate dữ liệu
  const valid: ValidStudent[] = []; // Dữ liệu hợp lệ
  const errors: RowError[] = []; // Lỗi theo dòng

  rows.forEach((r, idx) => { // idx bắt đầu từ 0
    const rowIndex = idx + 2; // +2 vì header thường ở dòng 1
    const studentId = String(r.studentId || '').trim(); // Chuẩn hóa: chuyển sang string và trim khoảng trắng
    const studentName = String(r.studentName || '').trim(); // Chuẩn hóa: chuyển sang string và trim khoảng trắng
    const phoneNumber = String(r.phoneNumber || '').trim();
    const email = String(r.email || '').trim().toLowerCase();
    const className = String(r.className || '').trim();

    const dob = excelDateToJSDate(r.dateOfBirth); // Chuyển đổi ngày sinh
    const hasMissing = !studentId || !studentName || !phoneNumber || !email || !className || !dob; // Kiểm tra trường bắt buộc
    if (hasMissing) {
      errors.push({ row: rowIndex, reason: 'Thiếu trường bắt buộc hoặc ngày sinh không hợp lệ' });
      return;
    }

    // Bạn có thể thêm regex phone/email ở đây nếu muốn
    valid.push({ // Dữ liệu hợp lệ
      studentId,
      studentName,
      phoneNumber,
      email,
      className,
      dateOfBirth: dob!,
    });
  });

  return { valid, errors }; // Trả về cả dữ liệu hợp lệ và lỗi
}

async function ensureClassesExist(classNames: string[]) { // Kiểm tra các lớp tồn tại trong DB
  const uniq = Array.from(new Set(classNames));
  const classes = await ClassModel.find({ className: { $in: uniq } }).select('className');
  const existing = new Set(classes.map(c => c.className));
  return existing;
}

async function upsertStudents(data: ValidStudent[]) {
  if (data.length === 0) return { upserted: 0, matchedUpdated: 0 };

  // Upsert dùng studentId là duy nhất; nếu bạn dùng email là unique thì thay filter theo email
  const ops = data.map(d => ({
    updateOne: {
      filter: { studentId: d.studentId },
      update: {
        $set: {
          studentName: d.studentName,
          dateOfBirth: d.dateOfBirth,
          phoneNumber: d.phoneNumber,
          email: d.email,
          className: d.className,
        },
      },
      upsert: true,
    },
  }));

  const result = await StudentModel.bulkWrite(ops, { ordered: false });
  const upserted = result.upsertedCount || 0;
  // matchedUpdated: các bản ghi có match và được update (nếu có thay đổi)
  const matchedUpdated = (result.modifiedCount || 0) + (result.matchedCount || 0) - upserted;
  return { upserted, matchedUpdated };
}

const StudentImportService = {
  async importFromExcel(filePath: string) {
    let rows: StudentRow[] = [];
    try {
      rows = await parseExcel(filePath);
      if (rows.length === 0) {
        throw new Error('File không có dữ liệu');
      }

      const { valid, errors } = normalizeAndValidate(rows);

      // Kiểm tra lớp tồn tại (để báo lỗi chi tiết từng dòng)
      const existing = await ensureClassesExist(valid.map(v => v.className));
      const validFiltered: ValidStudent[] = [];
      const classErrors: RowError[] = [];

      valid.forEach((v, i) => {
        if (!existing.has(v.className)) {
          classErrors.push({ row: i + 2, reason: `Lớp "${v.className}" không tồn tại` });
        } else {
          validFiltered.push(v);
        }
      });

      const writeRes = await upsertStudents(validFiltered);

      return {
        totalRows: rows.length,
        valid: valid.length,
        skippedByClass: classErrors.length,
        errors: [...errors, ...classErrors],
        upserted: writeRes.upserted,
        matchedUpdated: writeRes.matchedUpdated,
      };
    } finally {
      // Dọn file tạm
      try { await fs.unlink(filePath); } catch {}
    }
  },
};

export default StudentImportService;