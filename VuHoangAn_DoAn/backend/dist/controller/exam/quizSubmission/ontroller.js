import { QuizSubMissionService } from "../../../services/exam/quizSubmisstion/service.js";
export const quizSubmissionController = {
    async submit(req, res) {
        try {
            const submission = await QuizSubMissionService.submit(req.body);
            res.json(submission);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
//# sourceMappingURL=ontroller.js.map