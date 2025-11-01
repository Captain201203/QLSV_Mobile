// Đường dẫn: backend/src/services/material/service.ts
import MaterialModel from '../../models/material/model.js';
import LessonModel from '../../models/lesson/model.js';
import path from 'path';
import fs from 'fs';
export const MaterialService = {
    async getAll() {
        return MaterialModel.find();
    },
    async getById(id) {
        return MaterialModel.findOne({ materialId: id });
    },
    async getByLesson(lessonId) {
        // Kiểm tra bài học có tồn tại không
        const lesson = await LessonModel.findOne({ lessonId });
        if (!lesson) {
            throw new Error(`Lesson with ID ${lessonId} does not exist.`);
        }
        return MaterialModel.find({ lessonId });
    },
    async create(data) {
        // Kiểm tra bài học có tồn tại không
        const lesson = await LessonModel.findOne({ lessonId: data.lessonId });
        if (!lesson) {
            throw new Error(`Lesson with ID ${data.lessonId} does not exist.`);
        }
        // Kiểm tra tài liệu đã tồn tại chưa
        const existingMaterial = await MaterialModel.findOne({ materialId: data.materialId });
        if (existingMaterial) {
            throw new Error(`Material with ID ${data.materialId} already exists.`);
        }
        const material = new MaterialModel({
            ...data,
            uploadDate: new Date()
        });
        return material.save();
    },
    async update(id, data) {
        return MaterialModel.findOneAndUpdate({ materialId: id }, data, { new: true });
    },
    async delete(id) {
        const material = await MaterialModel.findOne({ materialId: id });
        if (!material) {
            throw new Error(`Material with ID ${id} does not exist.`);
        }
        // Xóa file nếu tồn tại
        const filePath = path.join(process.cwd(), material.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return MaterialModel.findOneAndDelete({ materialId: id });
    }
};
export default MaterialService;
//# sourceMappingURL=service.js.map