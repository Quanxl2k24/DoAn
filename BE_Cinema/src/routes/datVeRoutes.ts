import { Router } from "express";
import {
  datVe,
  lichSuGiaoDich,
} from "../controllers/datve/datVeController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import Joi from "joi";

const router = Router();

const datVeSchema = Joi.object({
  suatChieuId: Joi.string().uuid().required(),
  gheIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  phuongThuc: Joi.string()
    .valid("VNPAY", "MOMO", "ZALOPAY", "CARD", "ATM")
    .required(),
});

/**
 * @swagger
 * tags:
 *   name: DatVe
 *   description: API đặt vé và lịch sử giao dịch
 */

router.post("/", authenticateToken, validate(datVeSchema), datVe);
router.get("/lich-su", authenticateToken, lichSuGiaoDich);

export default router;