import mongoose, { Schema } from "mongoose";
const LessonItemSchema = new Schema({
    itemId: { type: String, required: true, unique: true },
    lessonId: { type: String, required: true, ref: "Lesson" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true },
});
export default mongoose.model("LessonItem", LessonItemSchema);
//# sourceMappingURL=model.js.map