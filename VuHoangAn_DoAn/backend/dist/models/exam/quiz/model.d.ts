import mongoose, { Document } from 'mongoose';
export interface IOption extends Document {
    optionId: string;
    text: string;
}
export interface IQuestion extends Document {
    questionId: string;
    text: string;
    options: IOption[];
    correctAnswer: string;
}
export interface IQuiz extends Document {
    quizId: string;
    lessonId: string;
    title: string;
    duration: number;
    questions: IQuestion[];
    createdAt: Date;
}
declare const _default: mongoose.Model<IQuiz, {}, {}, {}, mongoose.Document<unknown, {}, IQuiz> & IQuiz & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map