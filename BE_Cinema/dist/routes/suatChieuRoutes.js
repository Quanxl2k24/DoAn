"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const suatChieuController_1 = require("../controllers/suatchieu/suatChieuController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const createSuatChieuSchema = joi_1.default.object({
    phimId: joi_1.default.string().uuid().required(),
    phongId: joi_1.default.string().uuid().required(),
    thoiGianBatDau: joi_1.default.date().iso().required(),
});
/**
 * @swagger
 * tags:
 *   name: SuatChieus
 *   description: API quản lý suất chiếu
 */
router.get("/", suatChieuController_1.getSuatChieu);
router.post("/", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(createSuatChieuSchema), suatChieuController_1.createSuatChieu);
router.delete("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), suatChieuController_1.deleteSuatChieu);
exports.default = router;
//# sourceMappingURL=suatChieuRoutes.js.map