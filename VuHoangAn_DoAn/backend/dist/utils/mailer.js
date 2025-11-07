import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
// Load .env.local from project root
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
const transporter = nodemailer.createTransport({
    service: 'gmail', // sử dụng gmail
    host: 'smtp.gmail.com', // máy chủ SMTP của Gmail
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true
});
export const sendOTPEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: `"QLSV Support" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Mã xác thực đổi mật khẩu',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2196f3;">Xác thực đổi mật khẩu</h2>
          <p>Mã xác thực của bạn là:</p>
          <h1 style="color: #2196f3; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
          <p>Mã này sẽ hết hạn sau 5 phút.</p>
          <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
      `,
        });
        return true;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // tạo mã OTP 6 chữ số
};
transporter.verify(function (error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    }
    else {
        console.log('Email server is ready to send messages');
        console.log('Using email:', process.env.EMAIL_USER);
    }
});
//# sourceMappingURL=mailer.js.map