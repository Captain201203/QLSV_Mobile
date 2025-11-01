import { IClass } from '../../models/class/model.js';
import { IStudent } from '../../models/student/model.js';
export declare const ClassService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, IClass> & IClass & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, IClass> & IClass & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    create(data: {
        classId: string;
        className: string;
        department: string;
    }): Promise<import("mongoose").Document<unknown, {}, IClass> & IClass & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, data: Partial<IClass>): Promise<(import("mongoose").Document<unknown, {}, IClass> & IClass & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, IClass> & IClass & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getStudentInClass(classId: string): Promise<(import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getStudentInClassByName(className: string): Promise<(import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
};
export default ClassService;
//# sourceMappingURL=service.d.ts.map