// fe-react/app/services/lessonProgressService.ts
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export type LessonContentProgress = {
  content?: {
    videoWatchedMs?: number;
    videoDurationMs?: number;
    videoCompleted?: boolean;
    documentsCompleted?: boolean;
  };
};

export const lessonProgressService = {
  async setVideoProgress(lessonId: string, studentId: string, watchedMs: number, durationMs: number, isCompleted?: boolean) {
    const res = await axios.put(`${API}/lesson-progress/lesson/${encodeURIComponent(lessonId)}/video`, {
      studentId,
      watchedMs,
      durationMs,
      isCompleted,
    });
    return res.data as LessonContentProgress;
  },

  async setDocumentCompleted(lessonId: string, studentId: string, isCompleted: boolean) {
    const res = await axios.put(`${API}/lesson-progress/lesson/${encodeURIComponent(lessonId)}/document`, {
      studentId,
      isCompleted,
    });
    return res.data as LessonContentProgress;
  },

  async getProgress(lessonId: string, studentId: string) {
    const res = await axios.get(`${API}/lesson-progress/lesson/${encodeURIComponent(lessonId)}`, {
      params: { studentId, t: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return res.data as LessonContentProgress | null;
  },

  // Tổng hợp 50/50 với quiz
  async calculateLessonPercent(lessonId: string, studentId: string, numQuizzes: number, numCompleted: number, allMustBeDone = true) {
    const prog = await this.getProgress(lessonId, studentId);
    const contentDone = !!(prog?.content?.videoCompleted && prog?.content?.documentsCompleted);
    const contentPercent = contentDone ? 50 : 0;

    let quizzesPercent = 0;
    if (numQuizzes > 0) {
      if (allMustBeDone) {
        quizzesPercent = numCompleted === numQuizzes ? 50 : 0;
      } else {
        quizzesPercent = Math.round(50 * (numCompleted / numQuizzes));
      }
    }
    return contentPercent + quizzesPercent;
  },
};