import { LessonProgressService } from '../../services/lessonProgress/service.js';
export const LessonProgressController = {
    async setVideoProgress(req, res) {
        try {
            const lessonId = decodeURIComponent(req.params.lessonId);
            const { studentId, watchedMs, durationMs, isCompleted } = req.body;
            if (!studentId)
                return res.status(400).json({ error: 'studentId required' });
            console.log("🎥 [setVideoProgress] lessonId:", lessonId, "studentId:", studentId, {
                watchedMs, durationMs, isCompleted
            });
            const saved = await LessonProgressService.upsertVideoProgress(studentId, lessonId, watchedMs || 0, durationMs || 0, isCompleted);
            console.log("✅ [setVideoProgress] saved:", saved);
            res.json(saved);
        }
        catch (e) {
            console.error("❌ [setVideoProgress] error:", e);
            res.status(500).json({ error: 'Failed to save video progress' });
        }
    },
    async setDocumentRead(req, res) {
        try {
            const lessonId = decodeURIComponent(req.params.lessonId);
            const { studentId, isCompleted } = req.body;
            if (!studentId)
                return res.status(400).json({ error: 'studentId required' });
            console.log("📄 [setDocumentRead] lessonId:", lessonId, "studentId:", studentId, "isCompleted:", isCompleted);
            const saved = await LessonProgressService.markDocumentsRead(studentId, lessonId, !!isCompleted);
            console.log("✅ [setDocumentRead] saved:", saved);
            res.json(saved);
        }
        catch (e) {
            console.error("❌ [setDocumentRead] error:", e);
            res.status(500).json({ error: 'Failed to save document progress' });
        }
    },
    async getProgress(req, res) {
        try {
            const lessonId = decodeURIComponent(req.params.lessonId);
            const { studentId } = req.query;
            if (!studentId)
                return res.status(400).json({ error: 'studentId required' });
            console.log("📊 [getProgress] lessonId:", lessonId, "studentId:", studentId);
            const prog = await LessonProgressService.getByStudentLesson(studentId, lessonId);
            console.log("📦 [getProgress] result:", prog);
            res.json(prog || null);
        }
        catch (e) {
            console.error("❌ [getProgress] error:", e);
            res.status(500).json({ error: 'Failed to get progress' });
        }
    },
};
//# sourceMappingURL=controller.js.map