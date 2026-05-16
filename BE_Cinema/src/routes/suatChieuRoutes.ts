import { Router } from "express";
import {
  getSuatChieu,
  createSuatChieu,
  deleteSuatChieu,
} from "../controllers/suatchieu/suatChieuController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import Joi from "joi";

const router = Router();

const createSuatChieuSchema = Joi.object({
  phimId: Joi.string().uuid().required(),
  phongId: Joi.string().uuid().required(),
  thoiGianBatDau: Joi.date().iso().required(),
  giaSuatChieu: Joi.number().optional(),
});

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