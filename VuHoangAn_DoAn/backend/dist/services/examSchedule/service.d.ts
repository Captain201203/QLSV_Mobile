export declare const ExamScheduleService: {
    create(data: any): Promise<import("mongoose").Document<unknown, {}, import("../../models/ExamSchedule/model.js").IExamScheduele> & import("../../models/ExamSchedule/model.js").IExamScheduele & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getByClass(className: string, semester?: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/ExamSchedule/model.js").IExamScheduele> & import("../../models/ExamSchedule/model.js").IExamScheduele & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getByClassInRange(className: string, from: Date, to: Date): Promise<(import("mongoose").Document<unknown, {}, import("../../models/ExamSchedule/model.js").IExamScheduele> & import("../../models/ExamSchedule/model.js").IExamScheduele & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    update(id: string, data: any): Promise<(import("mongoose").Document<unknown, {}, import("../../models/ExamSchedule/model.js").IExamScheduele> & import("../../models/ExamSchedule/model.js").IExamScheduele & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/ExamSchedule/model.js").IExamScheduele> & import("../../models/ExamSchedule/model.js").IExamScheduele & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getSemestersByClass(className: string): Promise<string[]>;
};
//# sourceMappingURL=service.d.ts.map