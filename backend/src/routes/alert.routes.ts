import { Router } from "express";
import {
  generateNetworkAlerts,
  getNetworkAlerts,
} from "../controllers/alert.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", getNetworkAlerts);
router.post("/generate/:accessPointId", generateNetworkAlerts);

export default router;
