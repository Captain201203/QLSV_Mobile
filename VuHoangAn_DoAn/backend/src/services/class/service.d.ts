import { IClass } from '../../models/class/model.js';
export declare const ClassService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    create(data: {
        classId: string;
        className: string;
        department: string;
    }): Promise<import("mongoose").Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, data: Partial<IClass>): Promise<(import("mongoose").Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
export default ClassService;
//# sourceMappingURL=service.d.ts.map