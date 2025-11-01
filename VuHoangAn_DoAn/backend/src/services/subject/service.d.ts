import { ISubject } from '../../models/subject/model.js';
export declare const SubjectService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    create(data: {
        subjectId: string;
        subjectName: string;
        credits: number;
        department: string;
        description?: string;
    }): Promise<import("mongoose").Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: String, data: Partial<ISubject>): Promise<(import("mongoose").Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
export default SubjectService;
//# sourceMappingURL=service.d.ts.map