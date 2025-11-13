import mongoose, { Document } from 'mongoose';
export interface ILessonExtra extends Document {
    lessonId: string;
    videoUrl: string;
    updatedAt: Date;
}
export declare const LessonExtraModel: mongoose.Model<ILessonExtra, {}, {}, {}, mongoose.Document<unknown, {}, ILessonExtra> & ILessonExtra & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=model.d.ts.map