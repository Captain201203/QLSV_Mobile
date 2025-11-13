// fe-react/app/services/lessonExtraService.ts
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const lessonExtraService = {
  async getVideoByLesson(lessonId: string): Promise<{ lessonId: string; videoUrl: string }> {
    const normalizedId = normalizeLessonId(lessonId);
    const res = await axios.get(`${API}/lesson-extra/lesson/${encodeURIComponent(normalizedId)}/video`, {
      headers: { 'Cache-Control': 'no-cache' },
      params: { t: Date.now() },
    });
    return res.data;
  },

  async setVideoByLesson(lessonId: string, videoUrl: string): Promise<{ lessonId: string; videoUrl: string }> {
    const normalizedId = normalizeLessonId(lessonId);
    const res = await axios.put(`${API}/lesson-extra/lesson/${encodeURIComponent(normalizedId)}/video`, { videoUrl });
    return res.data;
  },
};

function normalizeLessonId(raw: string): string {
  try {
    // If already percent-encoded, decode once to canonical form
    if (raw.includes('%')) {
      return decodeURIComponent(raw);
    }
  } catch {
    // fall through
  }
  return raw;
}