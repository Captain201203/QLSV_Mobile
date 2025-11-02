import mongoose, { Document } from "mongoose";
export interface ILessonItem extends Document {
    itemId: string;
    lessonId: string;
    title: string;
    content: string;
    order: number;
}
declare const _default: mongoose.Model<ILessonItem, {}, {}, {}, mongoose.Document<unknown, {}, ILessonItem> & ILessonItem & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map