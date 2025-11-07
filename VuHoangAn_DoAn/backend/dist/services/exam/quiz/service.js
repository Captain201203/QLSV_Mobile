import QuizModel from '../../../models/exam/quiz/model.js';
import { randomUUID } from 'crypto';
export const QuizService = {
    async getAll() {
        return QuizModel.find();
    },
    async getByLesson(lessonId) {
        return QuizModel.find({ lessonId });
    },
    async create(data) {
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
    async update(quizId, data) {
        return QuizModel.findOneAndUpdate({ quizId }, data, { new: true });
    },
    async delete(quizId) {
        return QuizModel.findOneAndDelete({ quizId });
    },
    async getById(quizId) {
        return QuizModel.findOne({ quizId });
    }
};
//# sourceMappingURL=service.js.map