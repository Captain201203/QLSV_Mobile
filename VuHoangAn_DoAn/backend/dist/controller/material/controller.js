import { MaterialService } from '../../services/material/service.js';
export const MaterialController = {
    async getAll(req, res) {
        try {
            const materials = await MaterialService.getAll();
            res.status(200).json(materials);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" });
            }
            const material = await MaterialService.getById(id);
            if (!material) {
                return res.status(404).json({ message: "Material not found" });
            }
            res.status(200).json(material);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getByLesson(req, res) {
        try {
            const { lessonId } = req.params;
            if (!lessonId) {
                return res.status(400).json({ message: "Lesson ID parameter is required" });
            }
            const materials = await MaterialService.getByLesson(lessonId);
            res.status(200).json(materials);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const { materialId, lessonId, title, description, uploadedBy } = req.body;
            if (!materialId || !lessonId || !title || !uploadedBy) {
                return res.status(400).json({ message: "materialId, lessonId, title, and uploadedBy are required" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "File is required" });
            }
            const fileUrl = `/uploads/materials/${req.file.filename}`;
            const material = await MaterialService.create({
                materialId,
                lessonId,
                title,
                description,
                fileUrl,
                uploadedBy
            });
            res.status(201).json(material);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" });
            }
            const updateData = {
                title,
                description
            };
            // Nếu có file mới
            if (req.file) {
                updateData.fileUrl = `/uploads/materials/${req.file.filename}`;
            }
            const material = await MaterialService.update(id, updateData);
            if (!material) {
                return res.status(404).json({ message: "Material not found" });
            }
            res.status(200).json(material);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" });
            }
            await MaterialService.delete(id);
            res.status(200).json({ message: "Material deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
export default MaterialController;
//# sourceMappingURL=controller.js.map