import express from "express";
import { ScoreController } from "../../controller/score/controller.js";
const router = express.Router();
router.post("/", ScoreController.create);
router.get("/", ScoreController.getAll);
router.get("/:id", ScoreController.getById);
router.put("/:id", ScoreController.update);
router.delete("/:id", ScoreController.remove);
export default router;
//# sourceMappingURL=route.js.map