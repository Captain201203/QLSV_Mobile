import mongoose, { Document } from 'mongoose';
export interface IQuizSubmission extends Document {
    submissionId: string;
    quizId: string;
    studentId: string;
    answers: IAnswer[];
    score: number;
    submittedAt: Date;
}
export interface IAnswer {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
}
declare const _default: mongoose.Model<IQuizSubmission, {}, {}, {}, mongoose.Document<unknown, {}, IQuizSubmission> & IQuizSubmission & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map