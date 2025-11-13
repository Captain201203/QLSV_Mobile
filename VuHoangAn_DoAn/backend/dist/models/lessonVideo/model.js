// backend/src/models/lessonExtra/model.ts
import mongoose, { Schema } from 'mongoose';
const LessonExtraSchema = new Schema({
    lessonId: { type: String, required: true, index: true, unique: true },
    videoUrl: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
});
export const LessonExtraModel = mongoose.model('LessonExtra', LessonExtraSchema);
//# sourceMappingURL=model.js.map