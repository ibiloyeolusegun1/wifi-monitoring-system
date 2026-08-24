import { Router } from "express";
import {
  createCampus,
  getCampuses,
  getCampusById,
  updateCampus,
  deleteCampus,
} from "../controllers/campus.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createCampus);
router.get("/", getCampuses);
router.get("/:id", getCampusById);
router.put("/:id", updateCampus);
router.delete("/:id", deleteCampus);

export default router;