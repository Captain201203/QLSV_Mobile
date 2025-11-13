// backend/src/models/lessonProgress/model.ts
import mongoose, { Schema } from 'mongoose';
const LessonProgressSchema = new Schema({
    studentId: { type: String, index: true, required: true },
    lessonId: { type: String, index: true, required: true },
    content: {
        videoWatchedMs: { type: Number, default: 0 },
        videoDurationMs: { type: Number, default: 0 },
        videoCompleted: { type: Boolean, default: false },
        documentsCompleted: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
    },
}, { timestamps: true });
LessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
export const LessonProgressModel = mongoose.model('LessonProgress', LessonProgressSchema);
//# sourceMappingURL=model.js.map