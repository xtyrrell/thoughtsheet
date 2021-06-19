import { describe, expect, test } from "@jest/globals";
import request from "supertest";

import app from "../../app";

import { setupDatabase } from "../../utils/test-helpers";
import User from "../../models/user";

setupDatabase();

const dummyUser = {
  email: "sometestuser@example.com",
  phoneNumber: "27837770024",
};

const API_PATH = "";

describe("OTP codes", () => {
  test("POST /auth/request-code", async () => {
    const phoneNumber = "+27837770024";

    const userBeforeRequest = await User.findOne({ phoneNumber });
    expect(userBeforeRequest).toBeNull();

    const response = await request(app)
      .post(API_PATH + "/auth/request-code")
      .send({ phoneNumber });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("phoneNumber", phoneNumber);

    const user = await User.findOne({ phoneNumber });
    expect(user).not.toBeNull();
    expect(user).toHaveProperty("_id");
  });
});

describe("user creation", () => {
  test.skip("can create a user", async () => {
    // const response = await request(app).post(...).send(...)
    // expect(response.status).toBe(200)
    // expect(await DbClient.db.collection("user").find(...) // user was persisted to DB
  });
});
