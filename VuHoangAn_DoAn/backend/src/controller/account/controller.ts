import {Request, Response} from 'express';
import { createAccountForStudent } from '../../services/account/service.js';

export const generateAccount = async ( req: Request, res: Response) => { // tạo tài khoản cho sinh viên
    try{
        const result = await createAccountForStudent(); // gọi service tạo tài khoản
        res.json({
            message: "Tạo thành công tài khoản sinh viên",
            total: result.length,
            details: result,
        });
    }catch(error: any){
        res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo tài khoản",
            error: error.message
        });
    }
}