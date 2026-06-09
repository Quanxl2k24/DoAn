import { Router } from "express";
import {
  getPhongsByRap,
  getPhongById,
  createPhong,
  updatePhong,
  deletePhong,
} from "../controllers/phong/phongController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { createPhongSchema, updatePhongSchema } from "../validators/phongValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Phongs
 *   description: API quản lý phòng chiếu
 */

router.get("/rap/:rapId", getPhongsByRap);
router.get("/:id", getPhongById);
router.post("/", authenticateToken, requireRole("ADMIN"), validate(createPhongSchema), createPhong);
router.put("/:id", authenticateToken, requireRole("ADMIN"), validate(updatePhongSchema), updatePhong);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), deletePhong);

export default router;