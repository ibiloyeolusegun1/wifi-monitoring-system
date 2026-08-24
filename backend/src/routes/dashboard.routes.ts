import { Router } from "express";
import {
  dashboardSummary,
  recentPerformance,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/summary", dashboardSummary);
router.get("/performance", recentPerformance);

export default router;
