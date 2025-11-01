import mongoose, { Document } from 'mongoose';
export interface IStudent extends Document {
    studentId: string;
    studentName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    className: string;
}
declare const _default: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent> & IStudent & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map