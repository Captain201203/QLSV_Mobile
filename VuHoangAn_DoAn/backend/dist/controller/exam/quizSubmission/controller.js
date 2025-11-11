import { QuizSubMissionService } from "../../../services/exam/quizSubmisstion/service.js";
export const quizSubmissionController = {
    async submit(req, res) {
        try {
            const submission = await QuizSubMissionService.submit(req.body); // tạo mới submission
            res.json(submission);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getByStudent(req, res) {
        try {
            const submissions = await QuizSubMissionService.getByStudent(req.params.studentId); // lấy submission theo sinh viên
            res.json(submissions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getByQuiz(req, res) {
        try {
            const submission = await QuizSubMissionService.getByQuiz(req.params.quizId);
            res.json(submission);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getQuizStatus(req, res) {
        try {
            const { quizId, studentId } = req.params;
            const status = await QuizSubMissionService.getQuizStatus(quizId, studentId);
            res.json(status);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async unlockSubmission(req, res) {
        try {
            const { submissionId } = req.params;
            const { adminId, reason } = req.body;
            const submission = await QuizSubMissionService.unlockSubmission(submissionId, adminId, reason);
            res.json(submission);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async lockSubmission(req, res) {
        try {
            const { submissionId } = req.params;
            const submission = await QuizSubMissionService.lockSubmission(submissionId);
            res.json(submission);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
//# sourceMappingURL=controller.js.map