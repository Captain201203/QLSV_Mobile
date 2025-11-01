import { ISchedule } from "../../models/schedule/model.js";
export declare const ScheduleService: {
    getByClassInRange(className: string, startAt: Date, endAt: Date): Promise<(import("mongoose").Document<unknown, {}, ISchedule> & ISchedule & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(data: {
        className: string;
        subjectId: string;
        subjectName?: string;
        lecturer?: string;
        room?: string;
        startAt: Date;
        endAt: Date;
        note?: string;
    }): Promise<import("mongoose").Document<unknown, {}, ISchedule> & ISchedule & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, data: Partial<ISchedule>): Promise<(import("mongoose").Document<unknown, {}, ISchedule> & ISchedule & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, ISchedule> & ISchedule & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
//# sourceMappingURL=service.d.ts.map