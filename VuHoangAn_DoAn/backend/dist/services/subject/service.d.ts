import { ISubject } from '../../models/subject/model.js';
export declare const SubjectService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, ISubject> & ISubject & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, ISubject> & ISubject & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    create(data: {
        subjectId: string;
        subjectName: string;
        credits: number;
        department: string;
        description?: string;
    }): Promise<import("mongoose").Document<unknown, {}, ISubject> & ISubject & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: String, data: Partial<ISubject>): Promise<(import("mongoose").Document<unknown, {}, ISubject> & ISubject & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, ISubject> & ISubject & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
export default SubjectService;
//# sourceMappingURL=service.d.ts.map