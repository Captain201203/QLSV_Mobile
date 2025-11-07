import { AuthService } from '../../services/auth/service.js';
export const ForgotPasswordController = {
    async requestReset(req, res) {
        try {
            const { email } = req.body; // nhận email từ body request
            if (!email) {
                return res.status(400).json({ message: 'Email is required' }); // nếu email không tồn tại thì trả lỗi
            }
            const result = await AuthService.initiatePasswordReset(email); // gọi hàm initiatePasswordReset từ AuthService với email
            res.status(200).json({ message: 'OTP sent successfully', sessionId: result.sessionId }); // trả lời success với sessionId
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
    async verifyOTP(req, res) {
        try {
            const { sessionId, otp } = req.body; // nhận sessionId và otp từ body request
            if (!sessionId || !otp) {
                return res.status(400).json({ message: 'Thiếu sessionId hoặc otp' });
            }
            const isValid = await AuthService.verifyOTP(sessionId, otp); // gọi hàm verifyOTP từ AuthService với sessionId và otp
            if (isValid) {
                res.status(200).json({ message: 'OTP xác thực thành công' });
            }
            else {
                res.status(400).json({ message: 'OTP không chính xác' });
            }
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
    async resetPassword(req, res) {
        try {
            const { sessionId, newPassword } = req.body; // nhận sessionId và new password từ body request
            if (!sessionId || !newPassword) {
                return res.status(400).json({ message: 'Thiếu sessionId hoặc new password' });
            }
            await AuthService.resetPassword(sessionId, newPassword);
            res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
};
//# sourceMappingURL=forgotPassword.js.map