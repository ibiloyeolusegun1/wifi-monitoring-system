import { Router } from "express";
import { analyzeNetworkPerformance } from "../controllers/performance.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/:accessPointId", analyzeNetworkPerformance);

export default router;
