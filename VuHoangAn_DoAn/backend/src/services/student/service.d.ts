import { IStudent } from '../../models/student/model.js';
export declare const StudentService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    create(data: {
        studentId: string;
        studentName: string;
        classId: string;
        dateOfBirth: Date;
        phoneNumber: string;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, data: Partial<IStudent>): Promise<(import("mongoose").Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
export default StudentService;
//# sourceMappingURL=service.d.ts.map