import mongoose, { Document } from 'mongoose';
export interface IMaterial extends Document {
    materialId: string;
    lessonId: string;
    title: string;
    description: string;
    type: string;
    fileUrl: string;
    uploadBy: mongoose.Types.ObjectId;
    uploadDate: Date;
}
declare const _default: mongoose.Model<IMaterial, {}, {}, {}, mongoose.Document<unknown, {}, IMaterial> & IMaterial & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map