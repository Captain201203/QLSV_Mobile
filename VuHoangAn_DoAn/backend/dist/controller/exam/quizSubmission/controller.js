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
    }
};
//# sourceMappingURL=controller.js.map