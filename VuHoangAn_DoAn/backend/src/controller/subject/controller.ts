import {Request, Response} from "express";
import {SubjectService} from '../../services/subject/service.js';
import SubjectImportService from "../../services/subject/import.js";

export const SubjectController = {
    async getAll (req: Request, res: Response){
        try{
            const subject = await SubjectService.getAll(); // gọi service lấy tất cả môn học
            res.status(200).json(subject);

        }catch(error: any){
            res.status(500).json({message: error.message});
        }
    },
    
    async getById (req: Request, res: Response){
        try{
            const {id} = req.params; // Lấy id từ params

            if(!id){
                return res.status(400).json({message:"Id not found"});
            }
            return res.status(200).json(await SubjectService.getById(id)); // gọi service lấy môn học theo id
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    },

    async create (req: Request, res: Response){
        try{
            const data = req.body; // Lấy dữ liệu từ body request
            const newSubject = await SubjectService.create(data); // gọi service tạo mới môn học
            return res.status(201).json(newSubject); // trả về môn học mới tạo với mã trạng thái 201

        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    },

    async update (req: Request, res: Response){
        try{ 
            const {id} = req.params;
            if(!id){
                return res.status(400).json({message: "ID not found"}) // nếu không có id trong params thì trả về lỗi 400
            }
            return res.status(200).json(await SubjectService.update(id, req.body));// gọi service cập nhật môn học
        }catch(error: any){
            return res.status(500).json({message: error.message}); // 
        }
    },

    async delete (req: Request, res: Response){
        try{
            const{id} = req.params; // Lấy id từ params

            if (!id) {
                return res.status(400).json({message: "Id not found"});
            }
            return res.status(200).json(await SubjectService.delete(id)); // gọi service xóa môn học
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    },

    async importExcel (req: Request, res: Response){
        try{
            if (!req.file) {
                return res.status(400).json({ message: "File not found" });
            }
            const result = await SubjectImportService.importFromExcel(req.file.path);
            return res.status(200).json(result);
        }catch(error: any){
            return res.status(500).json({message: error.message});
        }
    }

}

export default SubjectController;