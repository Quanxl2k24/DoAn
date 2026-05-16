"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rapController_1 = require("../controllers/rap/rapController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const createRapSchema = joi_1.default.object({
    tenRap: joi_1.default.string().required(),
    diaChi: joi_1.default.string().required(),
});
const updateRapSchema = joi_1.default.object({
    tenRap: joi_1.default.string(),
    diaChi: joi_1.default.string(),
    trangThai: joi_1.default.string().valid("HOAT_DONG", "NGUNG_HOAT_DONG"),
});
/**
 * @swagger
 * tags:
 *   name: Raps
 *   description: API quản lý rạp chiếu
 */
router.get("/", rapController_1.getAllRaps);
router.get("/:id", rapController_1.getRapById);
router.post("/", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(createRapSchema), rapController_1.createRap);
router.put("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(updateRapSchema), rapController_1.updateRap);
router.delete("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), rapController_1.deleteRap);
exports.default = router;
//# sourceMappingURL=rapRoutes.js.map