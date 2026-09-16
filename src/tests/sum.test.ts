import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import request from "supertest";

vi.mock("../db.js");

import { app } from "../index.js";
import { prismaClient } from "../__mocks__/db.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /sum", () => {
  it("should return the sum of two numbers", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      result: 3,
    });

    const res = await request(app)
      .post("/sum")
      .send({
        a: 1,
        b: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
    expect(res.body.id).toBe(1);

    expect(prismaClient.sum.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        result: 3,
      },
    });
  });

  it("should return 411 for invalid input", async () => {
    const res = await request(app)
      .post("/sum")
      .send({
        a: "hello",
        b: 2,
      });

    expect(res.statusCode).toBe(411);

    // Prisma should NOT be called
    expect(prismaClient.sum.create).not.toHaveBeenCalled();
  });

  it("should return 500 if Prisma fails", async () => {
    prismaClient.sum.create.mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app)
      .post("/sum")
      .send({
        a: 1,
        b: 2,
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Something went wrong");
  });
});