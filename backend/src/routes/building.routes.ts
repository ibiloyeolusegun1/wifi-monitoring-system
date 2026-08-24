import { Router } from "express";

import {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from "../controllers/building.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createBuilding);
router.get("/", getBuildings);
router.get("/:id", getBuildingById);
router.put("/:id", updateBuilding);
router.delete("/:id", deleteBuilding);

export default router;