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
import Joi from "joi";

const router = Router();

const createPhongSchema = Joi.object({
  rapId: Joi.string().uuid().required(),
  tenPhong: Joi.string().required(),
  soHang: Joi.number().integer().min(1).max(26).optional(),
  soCot: Joi.number().integer().min(1).optional(),
});

const updatePhongSchema = Joi.object({
  tenPhong: Joi.string(),
  trangThai: Joi.string().valid("HOAT_DONG", "BAO_TRI"),
});

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