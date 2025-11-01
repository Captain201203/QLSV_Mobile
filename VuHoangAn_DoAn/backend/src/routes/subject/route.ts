import express from 'express';
import multer from 'multer';
import {SubjectController} from '../../controller/subject/controller.js';

const router = express.Router();
const upload = multer({ 
    dest: 'uploads/',
    limits:{fileSize: 10 * 1024 * 1024}, // 10MB
    fileFilter: (req, file, cb) => {
        const ok  = /xlsx|xls|csv/.test(file.originalname);
        ok? cb(null,true): cb(new Error('Chỉ nhận file excel'));
    }
});

router.get('/', SubjectController.getAll);
router.get('/:id', SubjectController.getById);
router.post('/', SubjectController.create);
router.put('/:id',SubjectController.update);
router.delete('/:id', SubjectController.delete);
router.post('/upload-excel', upload.single('file'), SubjectController.importExcel);

export default router;
