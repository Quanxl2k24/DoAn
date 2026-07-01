import { Router } from "express";
import {
  getSuatChieu,
  createSuatChieu,
  updateSuatChieu,
  deleteSuatChieu,
} from "../controllers/suatchieu/suatChieuController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { createSuatChieuSchema, updateSuatChieuSchema } from "../validators/suatChieuValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SuatChieus
 *   description: API quản lý suất chiếu
 */

router.get("/", getSuatChieu);
router.post(
  "/",
  authenticateToken,
  requireRole("ADMIN"),
  validate(createSuatChieuSchema),
  createSuatChieu
);
router.put("/:id", authenticateToken, requireRole("ADMIN"), validate(updateSuatChieuSchema), updateSuatChieu);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), deleteSuatChieu);

export default router;