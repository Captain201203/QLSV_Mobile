import mongoose, { Document, Schema } from 'mongoose';


// 1. Định nghĩa Interface (TypeScript): Đảm bảo type safety
export interface IStudent extends Document {
    studentId: string;
   
    studentName: string;
    dateOfBirth: Date; // Đã đổi tên thuộc tính theo quy ước camelCase
    phoneNumber: string;
    email: string;
    className: string;
}

// 2. Định nghĩa Schema (Mongoose): Đảm bảo cấu trúc và quy tắc DB
const StudentSchema: Schema = new Schema({
    // studentId: Mã sinh viên (Nên là UNIQUE)
    studentId: { type: String, required: true, unique: true },
    
    // classId: Tham chiếu đến Class
    className: { type: String, required: true },
    
    // studentName: Tên sinh viên (KHÔNG NÊN UNIQUE)
    studentName: { type: String, required: true },
    
    // dateOfBirth: Ngày sinh
    dateOfBirth: { type: Date, required: true }, // Đã sửa chính tả: required
    
    // phoneNumber: Số điện thoại
    phoneNumber: { type: String, required: true },
    
    // email: Địa chỉ email (Nên là UNIQUE)
    email: { type: String, required: true, unique: true },
});

// 3. Export Model để sử dụng trong Service/Repository
export default mongoose.model<IStudent>('Student', StudentSchema);