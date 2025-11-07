import { ILesson } from '../../models/lesson/model.js';
import mongoose from 'mongoose';
export declare const LessonService: {
    getAll(): Promise<(mongoose.Document<unknown, {}, ILesson> & ILesson & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(mongoose.Document<unknown, {}, ILesson> & ILesson & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    getByCourse(courseId: string): Promise<(mongoose.Document<unknown, {}, ILesson> & ILesson & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    create(data: {
        lessonId: string;
        courseId: string;
        title: string;
        description: string;
        order: number;
    }): Promise<mongoose.Document<unknown, {}, ILesson> & ILesson & {
        _id: mongoose.Types.ObjectId;
    }>;
    update(id: string, data: Partial<ILesson>): Promise<(mongoose.Document<unknown, {}, ILesson> & ILesson & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(mongoose.Document<unknown, {}, ILesson> & ILesson & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
};
export default LessonService;
//# sourceMappingURL=service.d.ts.map