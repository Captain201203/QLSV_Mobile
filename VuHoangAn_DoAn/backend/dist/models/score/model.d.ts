import mongoose, { Document } from "mongoose";
export interface IScore extends Document {
    studentId: string;
    subjectName?: string;
    className?: string;
    ex1Score: number;
    ex2Score: number;
    finalScore: number;
    GPA?: number;
    letterGrade?: string;
    semester: string;
    academicYear: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IScore, {}, {}, {}, mongoose.Document<unknown, {}, IScore> & IScore & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map