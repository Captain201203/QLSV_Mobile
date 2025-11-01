import mongoose, { Document } from 'mongoose';
export interface ILesson extends Document {
    lessonId: string;
    courseId: String;
    title: string;
    description: string;
    order: number;
}
declare const _default: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson> & ILesson & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map