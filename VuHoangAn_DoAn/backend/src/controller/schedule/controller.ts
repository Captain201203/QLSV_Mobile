import {Request, Response} from 'express'
import{ScheduleService} from '../../services/schedule/service.js'

export const ScheduleController = {

    // lấy thời khóa biểu theo lớp
    async getByClass(req: Request, res: Response){
        try{
            const { className} = req.params; // lấy class name từ tham số url
            const{from,to} = req. query; // lấy ngày bắt đầu và ngày kết thúc từ query params
            if(!className || !from || !to){ // nếu không có class name hoặc ngày bắt đầu hoặc ngày kết thúc, trả về lỗi 400
                return res.status(400).json({message: 'Thiếu class name hoặc ngày bắt đầu hoặc ngày kết thúc'})
            }
            const data = await ScheduleService.getByClassInRange( // lấy dữ liệu từ database
                className, 
                new Date(String(from)), 
                new Date(String(to))
            );
            return res.status(200).json(data); // trả về dữ liệu từ database


        }catch(error: any){
            return res.status(500).json({message: error.message})
        }
    },

    async create(req: Request, res: Response){
        try{
            const created = await ScheduleService.create(req.body);
            return res.status(201).json(created);


        }catch(error: any){
            return res.status(400).json({message: error.message})
        }
    },

    async update(req: Request, res: Response){
        try{
            const{id} = req.params;
            const updated = await ScheduleService.update(id, req.body);
            return res.status(200).json(updated);

        }catch(error: any){
            return res.status(500).json({message: error.message})
        }
    },

    async delete(req: Request, res: Response){
        try{
            const{id} = req.params;
            await ScheduleService.delete(id);
            return res.status(200).json({message: 'Đã xóa lịch thành công'});
        }catch(error: any){
            return res.status(500).json({message: error.message})
        }
    },
    
}

export default ScheduleController;