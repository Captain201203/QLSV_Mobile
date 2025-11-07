import mongoose, { Document } from 'mongoose';
export interface IDocument extends Document {
    documentId: string;
    lessonId: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument> & IDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=model.d.ts.map