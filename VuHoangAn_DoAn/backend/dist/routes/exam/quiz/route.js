import express from "express";
import { QuizController } from "../../../controller/exam/quiz/controller.js";
const router = express.Router();
router.get("/lesson/:lessonId", QuizController.getByLesson);
router.post("/", QuizController.create);
router.put("/:quizId", QuizController.update);
router.delete("/:quizId", QuizController.delete);
router.get("/:quizId", QuizController.getbyId);
export default router;
//# sourceMappingURL=route.js.map