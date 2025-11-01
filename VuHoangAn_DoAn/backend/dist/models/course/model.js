import mongoose, { Schema } from 'mongoose';
const CourseSchema = new Schema({
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    classes: { type: [mongoose.Schema.Types.ObjectId], ref: 'Class' }
});
export default mongoose.model('Course', CourseSchema);
//# sourceMappingURL=model.js.map