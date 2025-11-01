import mongoose, { Schema } from 'mongoose';
const MaterialSchema = new Schema({
    materialId: { type: String, required: true, unique: true },
    lessonId: { type: String, required: true, ref: 'Lesson' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadBy: { type: String, required: true, ref: 'Account' },
    uploadDate: { type: Date, default: Date.now },
});
export default mongoose.model('Material', MaterialSchema);
//# sourceMappingURL=model.js.map