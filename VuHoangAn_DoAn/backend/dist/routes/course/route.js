import express from 'express';
import { CourseController } from '../../controller/course/controller.js';
const router = express.Router();
router.get('/', CourseController.getAll);
router.get('/:id', CourseController.getById);
router.post('/', CourseController.create);
router.put('/:id', CourseController.update);
router.delete('/:id', CourseController.delete);
router.post('/:id/classes', CourseController.addClass);
router.delete('/:id/classes/:classId', CourseController.removeClass);
router.get('/:id/classes', CourseController.getClasses);
export default router;
//# sourceMappingURL=route.js.map