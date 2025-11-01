import { IMaterial } from '../../models/material/model.js';
export declare const MaterialService: {
    getAll(): Promise<(import("mongoose").Document<unknown, {}, IMaterial> & IMaterial & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getById(id: string): Promise<(import("mongoose").Document<unknown, {}, IMaterial> & IMaterial & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getByLesson(lessonId: string): Promise<(import("mongoose").Document<unknown, {}, IMaterial> & IMaterial & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(data: {
        materialId: string;
        lessonId: string;
        title: string;
        description: string;
        fileUrl: string;
        uploadedBy: string;
    }): Promise<import("mongoose").Document<unknown, {}, IMaterial> & IMaterial & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, data: Partial<IMaterial>): Promise<(import("mongoose").Document<unknown, {}, IMaterial> & IMaterial & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, IMaterial> & IMaterial & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
export default MaterialService;
//# sourceMappingURL=service.d.ts.map