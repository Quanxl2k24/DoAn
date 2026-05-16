"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = 3000;
app_1.default.listen(PORT, () => {
    database_1.pool
        .connect()
        .then(() => {
        console.log("Connected PostgreSQL");
    })
        .catch((err) => {
        console.log(err);
    });
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map