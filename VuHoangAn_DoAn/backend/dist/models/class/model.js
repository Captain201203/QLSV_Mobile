import mongoose, { Schema } from "mongoose";
const ClassSchema = new Schema({
    classId: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    department: { type: String, required: true },
    students: { type: [Schema.Types.ObjectId], ref: 'Student', default: [] },
});
export default mongoose.model('Class', ClassSchema);
//# sourceMappingURL=model.js.map