import { IQuiz } from '../../../models/exam/quiz/model.js';
export declare const QuizService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, IQuiz> & IQuiz & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getByLesson(lessonId: string): Promise<(import("mongoose").Document<unknown, {}, IQuiz> & IQuiz & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(data: Partial<IQuiz>): Promise<import("mongoose").Document<unknown, {}, IQuiz> & IQuiz & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(quizId: string, data: Partial<IQuiz>): Promise<(import("mongoose").Document<unknown, {}, IQuiz> & IQuiz & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(quizId: string): Promise<(import("mongoose").Document<unknown, {}, IQuiz> & IQuiz & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getById(quizId: string): Promise<(import("mongoose").Document<unknown, {}, IQuiz> & IQuiz & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
//# sourceMappingURL=service.d.ts.map