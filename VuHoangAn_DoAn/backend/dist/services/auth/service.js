import { generateOTP, sendOTPEmail } from '../../utils/mailer.js';
import AccountModel from '../../models/account/model.js';
import bcrypt from 'bcrypt';
// In-memory store for OTP sessions
const otpSessions = new Map();
// Clean up expired sessions every 5 minutes
setInterval(() => {
    const now = new Date();
    for (const [sessionId, session] of otpSessions.entries()) {
        // Remove sessions older than 5 minutes
        if (now.getTime() - session.createdAt.getTime() > 5 * 60 * 1000) {
            otpSessions.delete(sessionId);
        }
    }
}, 5 * 60 * 1000);
export const AuthService = {
    // Other auth methods...
    async initiatePasswordReset(email) {
        // Check if email exists in database
        const account = await AccountModel.findOne({ email });
        if (!account) {
            throw { status: 404, message: 'Email không tồn tại trong hệ thống' };
        }
        // Generate OTP and session
        const otp = generateOTP();
        const sessionId = Math.random().toString(36).substring(2);
        // Store in memory
        otpSessions.set(sessionId, {
            email,
            otp,
            createdAt: new Date(),
            verified: false
        });
        // Send OTP email
        await sendOTPEmail(email, otp);
        return { sessionId };
    },
    async verifyOTP(sessionId, providedOTP) {
        const session = otpSessions.get(sessionId);
        if (!session) {
            throw { status: 400, message: 'Phiên làm việc không hợp lệ hoặc đã hết hạn' };
        }
        if (session.verified) {
            throw { status: 400, message: 'Mã OTP này đã được sử dụng' };
        }
        const expired = new Date().getTime() - session.createdAt.getTime() > 5 * 60 * 1000;
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
    async resetPassword(sessionId, newPassword) {
        const session = otpSessions.get(sessionId);
        if (!session || !session.verified) {
            throw { status: 400, message: 'Phiên làm việc không hợp lệ hoặc chưa xác thực OTP' };
        }
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update password in database
        await AccountModel.findOneAndUpdate({ email: session.email }, { $set: { password: hashedPassword } });
        // Clear session
        otpSessions.delete(sessionId);
    }
};
//# sourceMappingURL=service.js.map