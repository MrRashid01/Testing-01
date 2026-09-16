"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_js_1 = require("./db.js");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const sumInput = zod_1.z.object({
    a: zod_1.z.number(),
    b: zod_1.z.number(),
});
exports.app.post("/sum", async (req, res) => {
    const parsedResponse = sumInput.safeParse(req.body);
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const answer = parsedResponse.data.a +
        parsedResponse.data.b;
    try {
        const response = await db_js_1.prismaClient.sum.create({
            data: {
                a: parsedResponse.data.a,
                b: parsedResponse.data.b,
                result: answer,
            },
        });
        res.json({
            answer,
            id: response.id,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
