// backend/src/models/lessonExtra/model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonExtra extends Document {
  lessonId: string;
  videoUrl: string;
  updatedAt: Date;
}

const LessonExtraSchema = new Schema<ILessonExtra>({
  lessonId: { type: String, required: true, index: true, unique: true },
  videoUrl: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export const LessonExtraModel = mongoose.model<ILessonExtra>('LessonExtra', LessonExtraSchema);