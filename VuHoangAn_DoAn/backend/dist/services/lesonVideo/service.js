// backend/src/services/lessonExtra/service.ts
import { LessonExtraModel } from "../../models/lessonVideo/model.js";
export const LessonExtraService = {
    async getByLesson(lessonId) {
        return LessonExtraModel.findOne({ lessonId });
    },
    async upsertVideo(lessonId, videoUrl) {
        return LessonExtraModel.findOneAndUpdate({ lessonId }, { lessonId, videoUrl, updatedAt: new Date() }, { new: true, upsert: true });
    },
};
//# sourceMappingURL=service.js.map