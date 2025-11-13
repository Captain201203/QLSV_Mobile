// backend/src/controller/lessonExtra/controller.ts
import { Request, Response } from 'express';
import { LessonExtraService } from '../../services/lesonVideo/service.js';

export const LessonExtraController = {
  async getVideoByLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const data = await LessonExtraService.getByLesson(lessonId);
      res.json({ lessonId, videoUrl: data?.videoUrl || '' });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load video' });
    }
  },

  async setVideoByLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const { videoUrl } = req.body as { videoUrl: string };
      const saved = await LessonExtraService.upsertVideo(lessonId, videoUrl || '');
      res.json({ lessonId: saved.lessonId, videoUrl: saved.videoUrl });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save video' });
    }
  },
};