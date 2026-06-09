import { Router } from "express";
import {
  getSuatChieu,
  createSuatChieu,
  deleteSuatChieu,
} from "../controllers/suatchieu/suatChieuController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { createSuatChieuSchema } from "../validators/suatChieuValidator";

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
router.delete("/:id", authenticateToken, requireRole("ADMIN"), deleteSuatChieu);

export default router;