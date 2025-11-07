import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';
const OptionSchema = new Schema({
    optionId: { type: String, required: true, default: randomUUID },
    text: { type: String, required: true },
});
const QuestionSchema = new Schema({
    questionId: { type: String, required: true, default: randomUUID },
    text: { type: String, required: true },
    options: { type: [OptionSchema], default: [] },
    correctAnswer: { type: String, required: true },
});
const QuizSchema = new Schema({
    quizId: { type: String, required: true, unique: true },
    lessonId: { type: String, required: true, ref: 'Lesson' },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    questions: { type: [QuestionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Quiz', QuizSchema); // model cho quiz
//# sourceMappingURL=model.js.map