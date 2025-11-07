import mongoose, { Document } from 'mongoose';
export interface ILesson extends Document {
    lessonId: string;
    courseId: String;
    title: string;
    description: string;
    order: number;
}
declare const LessonModel: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson> & ILesson & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const fixLessonIndexes: () => Promise<void>;
export default LessonModel;
//# sourceMappingURL=model.d.ts.map