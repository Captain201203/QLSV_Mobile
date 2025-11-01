import mongoose, { Document, Schema } from "mongoose";

export interface ILessonItem extends Document {
  itemId: string;
  lessonId: string; // liên kết đến bài học
  title: string;
  content: string;
  order: number;
}

const LessonItemSchema: Schema = new Schema({
  itemId: { type: String, required: true, unique: true },
  lessonId: { type: String, required: true, ref: "Lesson" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
});

export default mongoose.model<ILessonItem>("LessonItem", LessonItemSchema);
