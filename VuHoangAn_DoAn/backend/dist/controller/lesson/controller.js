import { LessonService } from '../../services/lesson/service.js';
export const LessonController = {
    async getAll(req, res) {
        try {
            const lessons = await LessonService.getAll();
            res.status(200).json(lessons);
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
            const lesson = await LessonService.getById(id);
            if (!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.status(200).json(lesson);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getByCourse(req, res) {
        try {
            const { courseId } = req.params;
            if (!courseId) {
                return res.status(400).json({ message: "Course ID parameter is required" });
            }
            const lessons = await LessonService.getByCourse(courseId);
            res.status(200).json(lessons);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const { lessonId, courseId, title, description, order } = req.body;
            if (!lessonId || !courseId || !title || order === undefined) {
                return res.status(400).json({ message: "lessonId, courseId, title, and order are required" });
            }
            const lesson = await LessonService.create({
                lessonId,
                courseId,
                title,
                description,
                order
            });
            res.status(201).json(lesson);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, order } = req.body;
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" });
            }
            const lesson = await LessonService.update(id, {
                title,
                description,
                order
            });
            if (!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.status(200).json(lesson);
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
            const lesson = await LessonService.delete(id);
            if (!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.status(200).json({ message: "Lesson deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
export default LessonController;
//# sourceMappingURL=controller.js.map