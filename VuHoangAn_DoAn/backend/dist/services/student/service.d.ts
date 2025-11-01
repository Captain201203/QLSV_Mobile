import { IStudent } from '../../models/student/model.js';
export declare const StudentService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    create(data: {
        studentId: string;
        studentName: string;
        className: string;
        dateOfBirth: Date;
        phoneNumber: string;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, data: Partial<IStudent>): Promise<(import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, IStudent> & IStudent & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getSubjectByStudent(studentId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/subject/model.js").ISubject> & import("../../models/subject/model.js").ISubject & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
};
export default StudentService;
//# sourceMappingURL=service.d.ts.map