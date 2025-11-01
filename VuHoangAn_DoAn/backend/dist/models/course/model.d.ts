import mongoose, { Document } from 'mongoose';
export interface ICourse extends Document {
    courseId: string;
    courseName: string;
    description: string;
    classes: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse> & ICourse & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map