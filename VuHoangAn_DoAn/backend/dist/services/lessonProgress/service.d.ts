export declare const LessonProgressService: {
    upsertVideoProgress(studentId: string, lessonId: string, watchedMs: number, durationMs: number, isCompleted?: boolean): Promise<import("mongoose").Document<unknown, {}, import("../../models/lessonProgress/model.js").ILessonProgress> & import("../../models/lessonProgress/model.js").ILessonProgress & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    markDocumentsRead(studentId: string, lessonId: string, isCompleted: boolean): Promise<import("mongoose").Document<unknown, {}, import("../../models/lessonProgress/model.js").ILessonProgress> & import("../../models/lessonProgress/model.js").ILessonProgress & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getByStudentLesson(studentId: string, lessonId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/lessonProgress/model.js").ILessonProgress> & import("../../models/lessonProgress/model.js").ILessonProgress & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
};
//# sourceMappingURL=service.d.ts.map