import mongoose, { Document } from 'mongoose';
import { IClass } from '../class/model.js';
export interface IStudent extends Document {
    studentId: string;
    classId: IClass['_id'];
    studentName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
}
declare const _default: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map