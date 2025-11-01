import mongoose, { Document } from "mongoose";
export interface IClass extends Document {
    classId: string;
    className: string;
    department: string;
}
declare const _default: mongoose.Model<IClass, {}, {}, {}, mongoose.Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map