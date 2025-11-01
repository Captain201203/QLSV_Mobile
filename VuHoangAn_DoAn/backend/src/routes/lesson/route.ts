// Đường dẫn: backend/src/routes/lesson/route.ts
import express from 'express';
import { LessonController } from '../../controller/lesson/controller.js';

const router = express.Router();

// Routes cho bài học
router.get('/', LessonController.getAll);
router.get('/:id', LessonController.getById);
router.get('/course/:courseId', LessonController.getByCourse);
router.post('/', LessonController.create);
router.put('/:id', LessonController.update);
router.delete('/:id', LessonController.delete);

export default router;