"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datVeController_1 = require("../controllers/datve/datVeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const datVeSchema = joi_1.default.object({
    suatChieuId: joi_1.default.string().uuid().required(),
    gheIds: joi_1.default.array().items(joi_1.default.string().uuid()).min(1).required(),
    phuongThuc: joi_1.default.string()
        .valid("VNPAY", "MOMO", "ZALOPAY", "CARD", "ATM")
        .required(),
});
/**
 * @swagger
 * tags:
 *   name: DatVe
 *   description: API đặt vé và lịch sử giao dịch
 */
router.post("/", authMiddleware_1.authenticateToken, (0, validateMiddleware_1.validate)(datVeSchema), datVeController_1.datVe);
router.get("/lich-su", authMiddleware_1.authenticateToken, datVeController_1.lichSuGiaoDich);
exports.default = router;
//# sourceMappingURL=datVeRoutes.js.map