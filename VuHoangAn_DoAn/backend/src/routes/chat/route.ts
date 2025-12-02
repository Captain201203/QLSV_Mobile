import { Router } from "express";
import { aiController } from "../../controller/chat/controller.js";

const router = Router();

router.post("/ask", aiController.askDocument);

export default router;
