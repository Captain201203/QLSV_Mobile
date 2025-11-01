import express from "express";
import { lessonItemController } from "../../controller/lessonItem/controller.js";

const router = express.Router();

router.get("/:lessonId", lessonItemController.getAllByLesson);
router.post("/", lessonItemController.create);
router.put("/:id", lessonItemController.update);
router.delete("/:id", lessonItemController.delete);

export default router;
