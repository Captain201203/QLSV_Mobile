import { ICourse } from '../../models/course/model.js';
export declare const CourseService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    create(data: {
        courseId: string;
        courseName: string;
        description: string;
    }): Promise<import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, data: Partial<ICourse>): Promise<(import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    addClass(courseId: string, classId: string): Promise<import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    removeClass(courseId: string, classId: string): Promise<import("mongoose").Document<unknown, {}, ICourse> & ICourse & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getClasses(courseId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/class/model.js").IClass> & import("../../models/class/model.js").IClass & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
};
export default CourseService;
//# sourceMappingURL=service.d.ts.map