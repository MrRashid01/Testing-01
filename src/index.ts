import express from "express";
import { z } from "zod";
import { prismaClient } from "./db.js";

export const app = express();


app.use(express.json());

const sumInput = z.object({
  a: z.number(),
  b: z.number(),
});

app.post("/sum", async (req, res) => {
  const parsedResponse = sumInput.safeParse(req.body);

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const answer =
    parsedResponse.data.a +
    parsedResponse.data.b;

  try {
    const response = await prismaClient.sum.create({
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
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});