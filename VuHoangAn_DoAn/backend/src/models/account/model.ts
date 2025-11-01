import mongoose, {Schema, Document} from "mongoose";

export interface IAccount extends Document{
    studentName: string;  // Tên sinh viên
    email: string;        // Email từ sinh viên (dùng làm username)
    password: string;     // Mật khẩu hash từ studentId
    role: string;         // Quyền (sinh viên)
}

const AccountSchema: Schema = new Schema ({
    studentName: {type: String, required: true},  // Tên sinh viên
    email: {type: String, unique: true, required: true},  // Email (username)
    password: {type: String, required: true},     // Mật khẩu hash
    role: {type: String, enum: ['admin', 'sinh viên'], default: 'sinh viên'}
}, {
    timestamps: true  // Tự động thêm createdAt, updatedAt
});

export default mongoose.model<IAccount>('Account', AccountSchema);