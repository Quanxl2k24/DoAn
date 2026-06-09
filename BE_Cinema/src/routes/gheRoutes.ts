import { Router } from "express";
import {
  getTrangThaiGhe,
  giuGhe,
  huyGiuGhe,
  getHeldSeats,
  getGhesByPhong,
  updateGhes,
} from "../controllers/ghe/gheController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ghes
 *   description: API quản lý ghế và giữ ghế
 */

// Lấy trạng thái ghế theo suất chiếu (public)
router.get("/trang-thai/:suatChieuId", getTrangThaiGhe);

// Giữ ghế (cần đăng nhập)
router.post("/giu", authenticateToken, giuGhe);

// Hủy giữ ghế
router.post("/huy-giu", authenticateToken, huyGiuGhe);

// Kiểm tra ghế đang giữ
router.get("/giu/:suatChieuId", authenticateToken, getHeldSeats);

// Quản lý ghế (Admin)
router.get("/phong/:phongId", authenticateToken, requireRole("ADMIN"), getGhesByPhong);
router.put("/update-many", authenticateToken, requireRole("ADMIN"), updateGhes);

export default router;