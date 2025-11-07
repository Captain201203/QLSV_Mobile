import { Request, Response } from "express";
import {QuizService} from "../../../services/exam/quiz/service.js";


export const QuizController = {
    async getByLesson(req: Request, res: Response){
        try{
            const quiz= await QuizService.getByLesson(req.params.lessonId);
            res.json(quiz);
        }catch(error: any){
            res.status(400).json({error: error.message});

        }
    },

    async create(req: Request, res: Response){
        try{
            const quiz = await QuizService.create(req.body);
            res.json(quiz);
        }catch(error: any){
            res.status(400).json({error:error.message});
        }
    },

    async update(req: Request, res: Response) {
        try {
            const quiz = await QuizService.update(req.params.quizId, req.body);
            res.json(quiz);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await QuizService.delete(req.params.quizId);
            res.json({ message: "Quiz deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async getbyId (req: Request, res: Response){
        try{
            const quiz = await QuizService.getById(req.params.quizId);
            if(!quiz){
                return res.status(404).json({message: "Quiz not found"});
            }
            res.status(200).json(quiz);
        }catch (error){
            return res.status(500).json({message: "Error fetching",error});
        }
        
    }
}