import { Router } from "express";
import {
  datVe,
  lichSuGiaoDich,
  adminLichSuGiaoDich,
} from "../controllers/datve/datVeController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { datVeSchema } from "../validators/datVeValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: DatVe
 *   description: API đặt vé và lịch sử giao dịch
 */

router.post("/", authenticateToken, validate(datVeSchema), datVe);
router.get("/lich-su", authenticateToken, lichSuGiaoDich);
router.get("/admin/lich-su", authenticateToken, requireRole("ADMIN"), adminLichSuGiaoDich);

export default router;