import express from 'express';
import { quizSubmissionController } from '../../../controller/exam/quizSubmission/controller.js';
import { QuizController } from '../../../controller/exam/quiz/controller.js';


const router = express.Router();

router.post("/submit", quizSubmissionController.submit);
router.get("/student/:studentId", quizSubmissionController.getByStudent);

export default router;