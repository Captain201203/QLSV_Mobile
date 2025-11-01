import mongoose, { Schema } from "mongoose";
const AccountSchema = new Schema({
    studentName: { type: String, required: true }, // Tên sinh viên
    email: { type: String, unique: true, required: true }, // Email (username)
    password: { type: String, required: true }, // Mật khẩu hash
    role: { type: String, enum: ['admin', 'sinh viên'], default: 'sinh viên' }
}, {
    timestamps: true // Tự động thêm createdAt, updatedAt
});
export default mongoose.model('Account', AccountSchema);
//# sourceMappingURL=model.js.map