// Đường dẫn: backend/src/controller/lesson/controller.ts
import { Request, Response } from 'express';
import { LessonService } from '../../services/lesson/service.js';

export const LessonController = {
    async getAll(req: Request, res: Response) {
        try {
            const lessons = await LessonService.getAll();
            res.status(200).json(lessons);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async getById(req: Request, res: Response) {
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
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async getByCourse(req: Request, res: Response) {
        try {
            const raw = String(req.params.courseId);
            const courseId = (() => { try { return decodeURIComponent(raw) } catch { return raw } })();
            
            if (!courseId) {
                return res.status(400).json({ message: "Course ID parameter is required" });
            }
            
            const lessons = await LessonService.getByCourse(courseId);
            res.status(200).json(lessons);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const rawCourse = String(req.body.courseId ?? '');
            const courseId = (() => { try { return decodeURIComponent(rawCourse) } catch { return rawCourse } })();
            const { lessonId, title, description, order } = req.body;
            
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
        } catch (error: any) {
            const msg = String(error?.message ?? 'Internal error');
            if (msg.includes('does not exist')) return res.status(404).json({ message: msg });
            if (msg.includes('already exists')) return res.status(409).json({ message: msg });
            res.status(500).json({ message: msg });
        }
    },

    async update(req: Request, res: Response) {
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
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async delete(req: Request, res: Response) {
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
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default LessonController;