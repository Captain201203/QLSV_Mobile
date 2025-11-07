import { IDocument } from '../../models/document/model.js';
import mongoose from 'mongoose';
export declare const DocumentService: {
    getByLesson(lessonId: string): Promise<(mongoose.Document<unknown, {}, IDocument> & IDocument & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    getById(documentId: string): Promise<(mongoose.Document<unknown, {}, IDocument> & IDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    create(data: {
        documentId: string;
        lessonId: string;
        title: string;
        content: string;
    }): Promise<mongoose.Document<unknown, {}, IDocument> & IDocument & {
        _id: mongoose.Types.ObjectId;
    }>;
    update(documentId: string, data: Partial<IDocument>): Promise<(mongoose.Document<unknown, {}, IDocument> & IDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    delete(documentId: string): Promise<(mongoose.Document<unknown, {}, IDocument> & IDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
};
export default DocumentService;
//# sourceMappingURL=service.d.ts.map