// backend/src/routes/lessonProgress/route.ts
import { Router } from 'express';
import { LessonProgressController } from '../../controller/lessonProgress/controller.js';
const router = Router();
router.put('/lesson/:lessonId/video', LessonProgressController.setVideoProgress);
router.put('/lesson/:lessonId/document', LessonProgressController.setDocumentRead);
router.get('/lesson/:lessonId', LessonProgressController.getProgress);
export default router;
//# sourceMappingURL=route.js.map