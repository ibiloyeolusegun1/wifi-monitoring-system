import { Router } from "express";
import {
  generateNetworkRecommendations,
  getNetworkRecommendations,
} from "../controllers/recommendation.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", getNetworkRecommendations);
router.post("/generate/:accessPointId", generateNetworkRecommendations);

export default router;
