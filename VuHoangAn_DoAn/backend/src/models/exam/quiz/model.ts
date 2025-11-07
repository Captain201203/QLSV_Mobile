import mongoose, { Document, Schema } from 'mongoose';
import { randomUUID } from 'crypto';

export interface IOption extends Document { // interface cho option
    optionId: string;
    text: string;
}

export interface IQuestion extends Document { // interface cho question
    questionId: string;
    text: string;
    options: IOption[];
    correctAnswer: string;
}

export interface IQuiz extends Document { // interface cho quiz
    quizId: string;
    lessonId: string;
    title: string;
    duration: number;
    questions: IQuestion[];
    createdAt: Date;
}

const OptionSchema: Schema = new Schema({ // schema cho option
    optionId: { type: String, required: true, default: randomUUID },
    text: { type: String, required: true },
});

const QuestionSchema: Schema = new Schema({ // schema cho question
    questionId: { type: String, required: true, default: randomUUID },
    text: { type: String, required: true },
    options: { type: [OptionSchema], default: [] },
    correctAnswer: { type: String, required: true },
});

const QuizSchema: Schema = new Schema({ // schema cho quiz
    quizId: { type: String, required: true, unique: true },
    lessonId: { type: String, required: true, ref: 'Lesson' },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    questions: { type: [QuestionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema); // model cho quiz

