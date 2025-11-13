// backend/src/services/lessonProgress/service.ts
import { LessonProgressModel } from '../../models/lessonProgress/model.js';

export const LessonProgressService = {
  async upsertVideoProgress(studentId: string, lessonId: string, watchedMs: number, durationMs: number, isCompleted?: boolean) {
    const videoCompleted = isCompleted === true || (durationMs > 0 && watchedMs / durationMs >= 0.95);
    return LessonProgressModel.findOneAndUpdate(
      { studentId, lessonId },
      {
        $set: {
          'content.videoWatchedMs': Math.max(0, watchedMs || 0),
          'content.videoDurationMs': Math.max(0, durationMs || 0), 
          
          'content.videoCompleted': videoCompleted,
          'content.updatedAt': new Date(),
        },
      },
      { new: true, upsert: true }
    );
  },

  async markDocumentsRead(studentId: string, lessonId: string, isCompleted: boolean) {
    return LessonProgressModel.findOneAndUpdate(
      { studentId, lessonId },
      {
        $set: {
          'content.documentsCompleted': !!isCompleted,
          'content.updatedAt': new Date(),
        },
      },
      { new: true, upsert: true }
    );
  },

  async getByStudentLesson(studentId: string, lessonId: string) {
    return LessonProgressModel.findOne({ studentId, lessonId });
  },
};