import { Router } from "express";

import {
  recordMetrics,
  getMetrics,
} from "../controllers/monitoring.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.post("/metrics", recordMetrics);
router.get("/metrics", getMetrics);

export default router;
