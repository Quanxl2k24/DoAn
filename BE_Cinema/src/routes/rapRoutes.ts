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
import Joi from "joi";

const router = Router();

const createRapSchema = Joi.object({
  tenRap: Joi.string().required(),
  diaChi: Joi.string().required(),
});

const updateRapSchema = Joi.object({
  tenRap: Joi.string(),
  diaChi: Joi.string(),
  trangThai: Joi.string().valid("HOAT_DONG", "NGUNG_HOAT_DONG"),
});

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