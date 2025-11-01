import mongoose, { Document } from "mongoose";
export interface IClass extends Document {
    classId: string;
    className: string;
    department: string;
    students: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IClass, {}, {}, {}, mongoose.Document<unknown, {}, IClass> & IClass & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map