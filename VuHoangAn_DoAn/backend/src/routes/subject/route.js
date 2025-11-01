import express from 'express';
import { SubjectController } from '../../controller/subject/controller.js';
const router = express.Router();
router.get('/', SubjectController.getAll);
router.get('/:id', SubjectController.getById);
router.post('/', SubjectController.create);
router.put('/:id', SubjectController.update);
router.delete('/:id', SubjectController.delete);
export default router;
//# sourceMappingURL=route.js.map