"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const phimRoutes_1 = __importDefault(require("./routes/phimRoutes"));
const rapRoutes_1 = __importDefault(require("./routes/rapRoutes"));
const phongRoutes_1 = __importDefault(require("./routes/phongRoutes"));
const suatChieuRoutes_1 = __importDefault(require("./routes/suatChieuRoutes"));
const gheRoutes_1 = __importDefault(require("./routes/gheRoutes"));
const datVeRoutes_1 = __importDefault(require("./routes/datVeRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Swagger Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/phims', phimRoutes_1.default);
app.use('/api/raps', rapRoutes_1.default);
app.use('/api/phongs', phongRoutes_1.default);
app.use('/api/suat-chieus', suatChieuRoutes_1.default);
app.use('/api/ghes', gheRoutes_1.default);
app.use('/api/dat-ve', datVeRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map