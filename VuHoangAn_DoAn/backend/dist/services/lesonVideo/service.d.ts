export declare const LessonExtraService: {
    getByLesson(lessonId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/lessonVideo/model.js").ILessonExtra> & import("../../models/lessonVideo/model.js").ILessonExtra & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    upsertVideo(lessonId: string, videoUrl: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/lessonVideo/model.js").ILessonExtra> & import("../../models/lessonVideo/model.js").ILessonExtra & {
        _id: import("mongoose").Types.ObjectId;
    }>;
};
//# sourceMappingURL=service.d.ts.map