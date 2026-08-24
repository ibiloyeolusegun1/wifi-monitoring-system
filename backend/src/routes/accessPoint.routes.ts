import { Router } from "express";

import {
  createAccessPoint,
  getAccessPoints,
  getAccessPointById,
  updateAccessPoint,
  deleteAccessPoint,
} from "../controllers/accessPoint.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createAccessPoint);
router.get("/", getAccessPoints);
router.get("/:id", getAccessPointById);
router.put("/:id", updateAccessPoint);
router.delete("/:id", deleteAccessPoint);

export default router;