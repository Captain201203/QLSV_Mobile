import { Request, Response } from "express";
import { QuizSubMissionService } from "../../../services/exam/quizSubmisstion/service.js";
import { error } from "console";

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
    },

    async getByQuiz(req: Request, res: Response){
        try{
            const submission = await QuizSubMissionService.getByQuiz(req.params.quizId)
            res.json(submission);
        }catch(error: any){
            res.status(400).json({error: error.message});
        }
    },

    async getQuizStatus(req: Request, res: Response){
        try{
            const {quizId, studentId} = req.params;
            const status = await QuizSubMissionService.getQuizStatus(quizId, studentId);
            res.json(status)
            
        }catch(error: any){
            res.status(400).json({error: error.message});
        }
    },

    async unlockSubmission(req: Request, res: Response){
        try{
            const {submissionId} = req.params;
            const {adminId, reason} = req.body;
            const submission = await QuizSubMissionService.unlockSubmission(submissionId, adminId, reason);
            res.json(submission);
        }catch(error: any){
            res.status(400).json({error: error.message});
        }
    },

    async lockSubmission(req: Request, res: Response){
        try{
            const{submissionId} = req.params
            const submission = await QuizSubMissionService.lockSubmission(submissionId);
            res.json(submission)
        }catch(error: any){
            res.status(400).json({error: error.message})
        }
    },

    async getScoresByLesson(req: Request,  res: Response) { // hàm lấy điểm quiz theo bài học cho sinh viên
        try {
            const { lessonId, studentId } = req.params;
            const scores = await QuizSubMissionService.getScoresByLesson(lessonId, studentId);
            res.json(scores);
        } catch (err) {
            res.status(500).json({ error: 'Failed to get quiz scores' });
        }
}

};