import mongoose, { Schema } from 'mongoose';
const LessonSchema = new Schema({
    lessonId: { type: String, required: true, unique: true },
    courseId: { type: String, required: true, ref: 'Course' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
});
export default mongoose.model('Lesson', LessonSchema);
//# sourceMappingURL=model.js.map