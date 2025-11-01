import express from "express";
import { generateAccount } from "../../controller/account/controller.js";
const router = express.Router();
router.post("/generate-from-students", generateAccount);
export default router;
//# sourceMappingURL=route.js.map