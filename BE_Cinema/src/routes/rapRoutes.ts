import { Router } from "express";
import {
  getAllRaps,
  getRapById,
  createRap,
  updateRap,
  deleteRap,
} from "../controllers/rap/rapController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { createRapSchema, updateRapSchema } from "../validators/rapValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Raps
 *   description: API quản lý rạp chiếu
 */

router.get("/", getAllRaps);
router.get("/:id", getRapById);
router.post("/", authenticateToken, requireRole("ADMIN"), validate(createRapSchema), createRap);
router.put("/:id", authenticateToken, requireRole("ADMIN"), validate(updateRapSchema), updateRap);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), deleteRap);

export default router;