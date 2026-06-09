import { Router } from "express";
import {
  getAllLoaiGhe,
  getLoaiGheById,
  createLoaiGhe,
  updateLoaiGhe,
  deleteLoaiGhe,
} from "../controllers/loaighe/loaiGheController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", getAllLoaiGhe);
router.get("/:id", getLoaiGheById);
router.post("/", authenticateToken, requireRole("ADMIN"), createLoaiGhe);
router.put("/:id", authenticateToken, requireRole("ADMIN"), updateLoaiGhe);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), deleteLoaiGhe);

export default router;
