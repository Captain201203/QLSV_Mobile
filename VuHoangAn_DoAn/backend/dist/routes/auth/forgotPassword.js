import express from 'express';
import { ForgotPasswordController } from '../../controller/auth/forgotPassword.js';
const router = express.Router();
// Password reset flow
router.post('/auth/forgot-password', ForgotPasswordController.requestReset);
router.post('/auth/verify-otp', ForgotPasswordController.verifyOTP);
router.post('/auth/reset-password', ForgotPasswordController.resetPassword);
export default router;
//# sourceMappingURL=forgotPassword.js.map