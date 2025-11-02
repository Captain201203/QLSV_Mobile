import { ILessonItem } from "../../models/lessonItem/model.js";
export declare const lessonItemService: {
    getAllByLesson: (lessonId: string) => Promise<(import("mongoose").Document<unknown, {}, ILessonItem> & ILessonItem & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ILessonItem> & ILessonItem & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    create: (data: ILessonItem) => Promise<import("mongoose").Document<unknown, {}, ILessonItem> & ILessonItem & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update: (id: string, data: Partial<ILessonItem>) => Promise<(import("mongoose").Document<unknown, {}, ILessonItem> & ILessonItem & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ILessonItem> & ILessonItem & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
//# sourceMappingURL=service.d.ts.map