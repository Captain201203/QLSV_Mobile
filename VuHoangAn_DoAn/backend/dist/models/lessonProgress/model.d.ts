import mongoose, { Document } from 'mongoose';
export interface ILessonProgress extends Document {
    studentId: string;
    lessonId: string;
    content: {
        videoWatchedMs: number;
        videoDurationMs: number;
        videoCompleted: boolean;
        documentsCompleted: boolean;
        updatedAt: Date;
    };
}
export declare const LessonProgressModel: mongoose.Model<ILessonProgress, {}, {}, {}, mongoose.Document<unknown, {}, ILessonProgress> & ILessonProgress & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=model.d.ts.map