import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizSubmission extends Document{
    submissionId: string;
    quizId: string;
    studentId: string;
    answers: IAnswer[];
    score: number;
    submittedAt: Date;
}

export interface IAnswer{
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
}

const AnswerSchema: Schema = new Schema({
    questionId: {type: String, required: true},
    selectedOptionId: {type: String, required: true},
    isCorrect: {type: Boolean, required: true},
});

const QuizSubmissionSchema: Schema = new Schema({
    submissionId: {type: String, required: true, unique: true},
    quizId: {type: String, required: true, ref: 'Quiz'},
    studentId: {type: String, required: true, ref: 'Student'},
    answers: {type: [AnswerSchema], default: []},
    score: {type: Number, required: true},
    submittedAt: {type: Date, default: Date.now},
});

export default mongoose.model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema);