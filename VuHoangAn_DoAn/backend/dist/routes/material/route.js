// Đường dẫn: backend/src/routes/material/route.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MaterialController } from '../../controller/material/controller.js';
const router = express.Router();
// Cấu hình multer để upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'materials');
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });
// Routes cho tài liệu
router.get('/', MaterialController.getAll);
router.get('/:id', MaterialController.getById);
router.get('/lesson/:lessonId', MaterialController.getByLesson);
router.post('/', upload.single('file'), MaterialController.create);
router.put('/:id', upload.single('file'), MaterialController.update);
router.delete('/:id', MaterialController.delete);
export default router;
//# sourceMappingURL=route.js.map