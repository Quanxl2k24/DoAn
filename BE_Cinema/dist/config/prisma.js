"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const database_1 = require("./database");
const adapter = new adapter_pg_1.PrismaPg(database_1.pool);
const prisma = new prisma_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=prisma.js.map