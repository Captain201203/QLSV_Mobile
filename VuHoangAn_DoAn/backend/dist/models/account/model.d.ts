import mongoose, { Document } from "mongoose";
export interface IAccount extends Document {
    studentName: string;
    email: string;
    password: string;
    role: string;
}
declare const _default: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount> & IAccount & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map