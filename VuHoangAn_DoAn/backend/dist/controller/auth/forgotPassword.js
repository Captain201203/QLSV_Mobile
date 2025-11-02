import { AuthService } from '../../services/auth/service.js';
export const ForgotPasswordController = {
    // Step 1: Request password reset by sending email
    async requestReset(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const result = await AuthService.initiatePasswordReset(email);
            res.status(200).json({ message: 'OTP sent successfully', sessionId: result.sessionId });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
    // Step 2: Verify OTP
    async verifyOTP(req, res) {
        try {
            const { sessionId, otp } = req.body;
            if (!sessionId || !otp) {
                return res.status(400).json({ message: 'Session ID and OTP are required' });
            }
            const isValid = await AuthService.verifyOTP(sessionId, otp);
            if (isValid) {
                res.status(200).json({ message: 'OTP verified successfully' });
            }
            else {
                res.status(400).json({ message: 'Invalid OTP' });
            }
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
    // Step 3: Reset password
    async resetPassword(req, res) {
        try {
            const { sessionId, newPassword } = req.body;
            if (!sessionId || !newPassword) {
                return res.status(400).json({ message: 'Session ID and new password are required' });
            }
            await AuthService.resetPassword(sessionId, newPassword);
            res.status(200).json({ message: 'Password reset successfully' });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
};
//# sourceMappingURL=forgotPassword.js.map