import mongoose, { Document } from 'mongoose';
export interface ISchedule extends Document {
    className: string;
    subjectId: string;
    subjectName: string;
    lecturer?: string;
    room?: string;
    startAt: Date;
    endAt: Date;
    note?: string;
}
declare const _default: mongoose.Model<ISchedule, {}, {}, {}, mongoose.Document<unknown, {}, ISchedule> & ISchedule & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map