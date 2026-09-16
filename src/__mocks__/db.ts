import { mockDeep } from "vitest-mock-extended";
import { PrismaClient } from "../generated/prisma/client.js";

export const prismaClient = mockDeep<PrismaClient>();