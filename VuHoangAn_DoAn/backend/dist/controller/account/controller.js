import { createAccountForStudent } from '../../services/account/service.js';
export const generateAccount = async (req, res) => {
    try {
        const result = await createAccountForStudent(); // gọi service tạo tài khoản
        res.json({
            message: "Tạo thành công tài khoản sinh viên",
            total: result.length,
            details: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo tài khoản",
            error: error.message
        });
    }
};
//# sourceMappingURL=controller.js.map