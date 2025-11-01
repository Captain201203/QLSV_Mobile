import express from 'express';
import multer from 'multer';
import { ClassController} from '../../controller/class/controller.js';

const router = express.Router();
const upload = multer({ 
    dest: 'uploads/',
    limits:{fileSize: 10 * 1024 * 1024}, // 10MB
    fileFilter: (req, file, cb) => {
        const ok  = /xlsx|xls|csv/.test(file.originalname);
        ok? cb(null,true): cb(new Error('Chỉ nhận file excel'));
    }
});

router.get('/', ClassController.getAll);
router.get('/name/:className/students', ClassController.getStudentsInClassByName); // Lấy sinh viên theo tên lớp
router.get('/:id/students', ClassController.getStudentsInClass); // Lấy sinh viên theo ID (backup)
router.get('/:id', ClassController.getById);
router.post('/', ClassController.create);
router.put('/:id',ClassController.update);
router.delete('/:id', ClassController.delete);
router.post('/upload-excel', upload.single('file'), ClassController.importExcel);

export default router;
