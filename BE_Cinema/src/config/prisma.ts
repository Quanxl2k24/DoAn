import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { pool } from "./database";

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
