import mongoose, { Schema } from 'mongoose';
const SubjectSchema = new Schema({
    subjectId: { type: String, required: true, unique: true },
    subjectName: { type: String, required: true },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
    description: { type: String, required: false },
});
export default mongoose.model('Subject', SubjectSchema);
//# sourceMappingURL=model.js.map