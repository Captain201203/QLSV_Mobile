import QuizModel from '../../../models/exam/quiz/model.js';
import { randomUUID } from 'crypto';
export const QuizService = {
    async getAll() {
        return QuizModel.find();
    },
    async getByLesson(lessonId) {
        console.log(`[QuizService] Raw lessonId received: "${lessonId}"`);
        // Decode URL nếu cần
        let decodedLessonId = lessonId;
        try {
            decodedLessonId = decodeURIComponent(lessonId);
            console.log(`[QuizService] Decoded lessonId: "${decodedLessonId}"`);
        }
        catch (e) {
            console.log(`[QuizService] lessonId is not URL encoded, using original: "${lessonId}"`);
            decodedLessonId = lessonId;
        }
        // Encode lessonId để tìm trong DB (vì có thể DB lưu dạng encoded)
        let encodedLessonId = lessonId;
        try {
            encodedLessonId = encodeURIComponent(decodedLessonId);
            console.log(`[QuizService] Encoded lessonId: "${encodedLessonId}"`);
        }
        catch (e) {
            encodedLessonId = lessonId;
        }
        // Log tất cả quizzes để debug (chỉ log lần đầu để tránh spam)
        const allQuizzes = await QuizModel.find({});
        if (allQuizzes.length > 0) {
            console.log(`[QuizService] Sample quiz lessonId from DB: "${allQuizzes[0].lessonId}"`);
        }
        // Tìm cả lessonId gốc, decoded, và encoded
        const query = {
            $or: [
                { lessonId: decodedLessonId }, // "BÀI 1"
                { lessonId: lessonId }, // Original
                { lessonId: encodedLessonId }, // "B%C3%80I%201"
            ]
        };
        console.log(`[QuizService] Query:`, JSON.stringify(query));
        const results = await QuizModel.find(query);
        console.log(`[QuizService] Found ${results.length} quizzes`);
        return results;
    },
    async create(data) {
        // Đảm bảo lessonId được decode trước khi lưu
        let normalizedLessonId = data.lessonId;
        if (normalizedLessonId) {
            try {
                // Nếu lessonId đã được encode, decode nó
                if (normalizedLessonId.includes('%')) {
                    normalizedLessonId = decodeURIComponent(normalizedLessonId);
                    console.log(`[QuizService] Decoded lessonId before saving: "${normalizedLessonId}"`);
                }
            }
            catch (e) {
                // Nếu không decode được, giữ nguyên
                console.log(`[QuizService] Using lessonId as-is: "${normalizedLessonId}"`);
            }
        }
        const newQuiz = new QuizModel({
            quizId: randomUUID(), // randomUUID là hàm tạo ra một chuỗi ngẫu nhiên
            title: data.title,
            duration: data.duration,
            lessonId: normalizedLessonId,
            // default empty questions if not provided
            questions: Array.isArray(data.questions) ? data.questions : [],
        });
        console.log(`[QuizService] Creating quiz with lessonId: "${normalizedLessonId}"`);
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