import mongoose, { Schema } from 'mongoose';
const DocumentSchema = new Schema({
    documentId: { type: String, required: true, unique: true },
    lessonId: { type: String, required: true, ref: 'Lesson' },
    title: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model('Document', DocumentSchema);
//# sourceMappingURL=model.js.map