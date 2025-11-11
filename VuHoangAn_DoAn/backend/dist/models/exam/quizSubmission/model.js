import mongoose, { Schema } from 'mongoose';
const AnswerSchema = new Schema({
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});
const QuizSubmissionSchema = new Schema({
    submissionId: { type: String, required: true, unique: true },
    quizId: { type: String, required: true, ref: 'Quiz' },
    studentId: { type: String, required: true, ref: 'Student' },
    answers: { type: [AnswerSchema], default: [] },
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'locked', 'allowed'] },
    attempts: { type: Number, default: 1 },
    unlockedBy: { type: String, ref: 'Account' },
    unlockedAt: { type: Date },
    lockedAt: { type: Date }
});
export default mongoose.model('QuizSubmission', QuizSubmissionSchema);
//# sourceMappingURL=model.js.map