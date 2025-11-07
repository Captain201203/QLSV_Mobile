import { generateOTP, sendOTPEmail } from '../../utils/mailer.js';
import AccountModel from '../../models/account/model.js';
import bcrypt from 'bcrypt';
const otpSessions = new Map();
setInterval(() => {
    const now = new Date();
    for (const [sessionId, session] of otpSessions.entries()) { // duyệt qua tất cả các phiên trong bộ nhớ, entries dùng để lấy cả khóa và giá trị
        if (now.getTime() - session.createdAt.getTime() > 5 * 60 * 1000) { // nếu phiên đã tồn tại hơn 5 phút
            otpSessions.delete(sessionId); // xóa phiên khỏi bộ nhớ
        }
    }
}, 5 * 60 * 1000);
export const AuthService = {
    // Other auth methods...
    async initiatePasswordReset(email) {
        const account = await AccountModel.findOne({ email }); // kiểm tra email có tồn tại không
        if (!account) {
            throw { status: 404, message: 'Email không tồn tại trong hệ thống' };
        }
        // nếu có email trong hệ thống, tạo mã OTP và phiên làm việc
        const otp = generateOTP();
        const sessionId = Math.random().toString(36).substring(2); // tạo sessionId ngẫu nhiên
        // tạo một phiên OTP mới và lưu vào bộ nhớ, .set là phương thức để thêm mới vào bản đồ
        otpSessions.set(sessionId, {
            email,
            otp,
            createdAt: new Date(),
            verified: false
        });
        // gọi hàm gửi email với mã OTP từ utils/mailer.ts
        await sendOTPEmail(email, otp);
        return { sessionId };
    },
    async verifyOTP(sessionId, providedOTP) {
        const session = otpSessions.get(sessionId); // lấy phiên từ bộ nhớ theo sessionId
        if (!session) {
            throw { status: 400, message: 'Phiên làm việc không hợp lệ hoặc đã hết hạn' };
        }
        if (session.verified) {
            throw { status: 400, message: 'Mã OTP này đã được sử dụng' };
        }
        const expired = new Date().getTime() - session.createdAt.getTime() > 5 * 60 * 1000; // kiểm tra xem mã OTP đã hết hạn (5 phút) chưa
        if (expired) {
            otpSessions.delete(sessionId);
            throw { status: 400, message: 'Mã OTP đã hết hạn' };
        }
        if (session.otp !== providedOTP) {
            throw { status: 400, message: 'Mã OTP không chính xác' };
        }
        // Mark as verified
        session.verified = true;
        otpSessions.set(sessionId, session);
        return true;
    },
    // hàm đặt lại mật khẩu
    async resetPassword(sessionId, newPassword) {
        const session = otpSessions.get(sessionId);
        if (!session || !session.verified) {
            throw { status: 400, message: 'Phiên làm việc không hợp lệ hoặc chưa xác thực OTP' };
        }
        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await AccountModel.findOneAndUpdate(// cập nhật mật khẩu trong database
        { email: session.email }, // tìm email trong database
        { $set: { password: hashedPassword } } // cập nhật mật khẩu mới, $set là operator để cập nhật
        );
        // Clear session
        otpSessions.delete(sessionId); // xóa phiên khỏi bộ nhớ
    }
};
//# sourceMappingURL=service.js.map