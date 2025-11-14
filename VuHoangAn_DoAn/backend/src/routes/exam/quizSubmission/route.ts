import express from 'express';
import { quizSubmissionController } from '../../../controller/exam/quizSubmission/controller.js';
import { QuizController } from '../../../controller/exam/quiz/controller.js';


const router = express.Router();

router.post("/submit", quizSubmissionController.submit);
router.get("/student/:studentId", quizSubmissionController.getByStudent);
router.get("/quiz/:quizId", quizSubmissionController.getByQuiz);
router.get("/quiz/:quizId/student/:studentId/status", quizSubmissionController.getQuizStatus);
router.put("/:submissionId/unlock", quizSubmissionController.unlockSubmission);
router.put("/:submissionId/lock", quizSubmissionController.lockSubmission);
router.get('/lesson/:lessonId/student/:studentId/scores', quizSubmissionController.getScoresByLesson);
    


export default router;