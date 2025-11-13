// backend/src/routes/lessonExtra/route.ts
import { Router } from 'express';
import { LessonExtraController } from '../../controller/lessonVideo/controller.js';

const router = Router();

router.get('/lesson/:lessonId/video', LessonExtraController.getVideoByLesson);
router.put('/lesson/:lessonId/video', LessonExtraController.setVideoByLesson);

export default router;