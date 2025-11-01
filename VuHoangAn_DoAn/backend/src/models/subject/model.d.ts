import mongoose, { Document } from 'mongoose';
export interface ISubject extends Document {
    subjectId: string;
    subjectName: string;
    credits: number;
    department: string;
    description: string;
}
declare const _default: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map