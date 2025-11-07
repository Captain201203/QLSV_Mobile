import QuizModel, { IQuiz } from '../../../models/exam/quiz/model.js';
import { randomUUID } from 'crypto';


export const QuizService = {
    async getAll(){ // lấy toàn bộ bài kiểm tra 
        return QuizModel.find();
    },

    async getByLesson(lessonId:string){ // lấy bài kiểm tra theo lessonId
        return QuizModel.find({lessonId})
    },

    async create (data: Partial<IQuiz>){ // tạo mới bài kiểm tra 
        const newQuiz = new QuizModel({
            quizId: randomUUID(), // randomUUID là hàm tạo ra một chuỗi ngẫu nhiên
            title: data.title,
            duration: data.duration,
            lessonId: data.lessonId,
            // default empty questions if not provided
            questions: Array.isArray(data.questions) ? data.questions : [],
        });
        return newQuiz.save();
    },

    async update(quizId:string, data: Partial<IQuiz>){ // cập nhật bài kiểm tra 
        return QuizModel.findOneAndUpdate({quizId}, data, {new: true }) 
    },

    async delete(quizId:string){ // xóa bài kiểm tra 
        return QuizModel.findOneAndDelete({quizId});
    },

    async getById(quizId:string){ // lấy bài kiểm tra theo quizId
        return QuizModel.findOne({quizId});
    }
}