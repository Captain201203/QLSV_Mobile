// Đường dẫn: backend/src/routes/document/route.ts
import express from 'express'
import { DocumentController } from '../../controller/document/controller.js'

const router = express.Router()

// Routes cho document
router.get('/lesson/:lessonId', DocumentController.getByLesson)
router.get('/:id', DocumentController.getById)
router.post('/', DocumentController.create)
router.put('/:id', DocumentController.update)
router.delete('/:id', DocumentController.delete)

export default router



