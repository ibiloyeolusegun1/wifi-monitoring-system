import { Router } from "express";

import {
  performanceReport,
  alertReport,
  recommendationReport,
  accessPointReport,
} from "../controllers/report.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/performance", performanceReport);
router.get("/alerts", alertReport);
router.get("/recommendations", recommendationReport);
router.get("/access-points", accessPointReport);

export default router;
