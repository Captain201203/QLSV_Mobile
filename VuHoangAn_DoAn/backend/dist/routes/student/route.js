import express from 'express';
import multer from 'multer';
import { StudentController } from '../../controller/student/controller.js';
const router = express.Router();
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const ok = /xlsx|xls|csv/.test(file.originalname);
        ok ? cb(null, true) : cb(new Error('Chỉ nhận file excel'));
    }
});
router.get('/', StudentController.getAll);
router.post('/login', StudentController.loginStudent);
router.get('/:studentId/subjects', StudentController.getSubjectByStudent);
router.get('/:id', StudentController.getById);
router.post('/', StudentController.create);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.delete);
router.post('/upload-excel', upload.single('file'), StudentController.importExcel);
export default router;
//# sourceMappingURL=route.js.map