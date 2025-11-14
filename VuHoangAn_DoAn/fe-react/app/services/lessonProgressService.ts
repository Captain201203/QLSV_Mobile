// fe-react/app/services/lessonProgressService.ts
import axios from 'axios';
import { QuizSubmissionService } from './quizSubmissionService';

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
  async calculateLessonPercent(lessonId: string, studentId: string) {

  const prog = await this.getProgress(lessonId, studentId);

  const contentDone =
    !!(prog?.content?.videoCompleted && prog?.content?.documentsCompleted);

  const contentPercent = contentDone ? 50 : 0;

  // --- lấy điểm quiz ---
  const quizScores = await QuizSubmissionService.getScoresByLesson(lessonId, studentId);

  // nếu không có quiz → quiz = 0
  if (!quizScores.length) return contentPercent;

  const avgScore = quizScores.reduce((t, q) => t + q, 0) / quizScores.length;

  // quiz chiếm 50%
  const quizzesPercent = (avgScore / 100) * 50;

  return contentPercent + quizzesPercent;
}

};