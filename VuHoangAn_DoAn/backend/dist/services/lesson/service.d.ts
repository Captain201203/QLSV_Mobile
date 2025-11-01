import { ILesson } from '../../models/lesson/model.js';
export declare const LessonService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, ILesson> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, ILesson> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getByCourse(courseId: string): Promise<(import("mongoose").Document<unknown, {}, ILesson> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(data: {
        lessonId: string;
        courseId: string;
        title: string;
        description: string;
        order: number;
    }): Promise<import("mongoose").Document<unknown, {}, ILesson> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, data: Partial<ILesson>): Promise<(import("mongoose").Document<unknown, {}, ILesson> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, ILesson> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
export default LessonService;
//# sourceMappingURL=service.d.ts.map