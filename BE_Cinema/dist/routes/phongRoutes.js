"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phongController_1 = require("../controllers/phong/phongController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const createPhongSchema = joi_1.default.object({
    rapId: joi_1.default.string().uuid().required(),
    tenPhong: joi_1.default.string().required(),
});
const updatePhongSchema = joi_1.default.object({
    tenPhong: joi_1.default.string(),
    trangThai: joi_1.default.string().valid("HOAT_DONG", "BAO_TRI"),
});
/**
 * @swagger
 * tags:
 *   name: Phongs
 *   description: API quản lý phòng chiếu
 */
router.get("/rap/:rapId", phongController_1.getPhongsByRap);
router.post("/", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(createPhongSchema), phongController_1.createPhong);
router.put("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(updatePhongSchema), phongController_1.updatePhong);
router.delete("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), phongController_1.deletePhong);
exports.default = router;
//# sourceMappingURL=phongRoutes.js.map