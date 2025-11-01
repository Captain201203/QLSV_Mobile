import moongose, { Document } from 'mongoose';
export interface IExamScheduele extends Document {
    className: string;
    ssubjectId: string;
    subjectName: string;
    examType: string;
    startTime: Date;
    endTime: Date;
    room: string;
    lecture?: string;
    note?: string;
    semester: string;
}
declare const _default: moongose.Model<IExamScheduele, {}, {}, {}, moongose.Document<unknown, {}, IExamScheduele> & IExamScheduele & {
    _id: moongose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map