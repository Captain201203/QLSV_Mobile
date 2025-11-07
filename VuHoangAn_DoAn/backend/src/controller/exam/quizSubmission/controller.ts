import { Request, Response } from "express";
import { QuizSubMissionService } from "../../../services/exam/quizSubmisstion/service.js";

export const quizSubmissionController ={ // controller cho quiz submission
    async submit(req:Request, res:Response){ // tạo mới submission
        try{
            const submission = await QuizSubMissionService.submit(req.body); // tạo mới submission
            res.json(submission)
        }catch(error: any){
            res.status(400).json({error:error.message});
        }
    },

    async getByStudent(req: Request, res: Response){ // lấy submission theo sinh viên
        try{
            const submissions = await QuizSubMissionService.getByStudent(req.params.studentId); // lấy submission theo sinh viên
            res.json(submissions);
        }catch(error: any){
            res.status(500).json({error:error.message});
        }
    }
};