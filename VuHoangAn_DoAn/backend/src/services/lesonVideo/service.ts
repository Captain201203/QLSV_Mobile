// backend/src/services/lessonExtra/service.ts
import { LessonExtraModel } from "../../models/lessonVideo/model.js";

export const LessonExtraService = {
  async getByLesson(lessonId: string) {
    return LessonExtraModel.findOne({ lessonId });
  },

  async upsertVideo(lessonId: string, videoUrl: string) {
    return LessonExtraModel.findOneAndUpdate(
      { lessonId },
      { lessonId, videoUrl, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  },
};