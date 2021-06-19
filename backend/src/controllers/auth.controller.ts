import crypto from "crypto";
import Router from "express-promise-router";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uuid from "uuid";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import { NotFoundError } from "../middleware/errors";
import authUser from "../middleware/auth";
import requireEnvVar from "../utils/env";

const routes = Router();

// TODO(xtyrrell): v2: rate-limit these routes

// TODO(xtyrrell): v1: use Redis with TTLs rather
const codes: any = {};

// TODO(xtyrrell): v2: follow JWT best practices by expiring sooner, using a refresh token,
// setting `audience` and other options
const generateToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ id: userId }, requireEnvVar("SECRET"), {
    expiresIn: "60d",
  });
};

/**
 * Handles the first step of the OTP code-based signup/signin flow.
 *
 * Generates a secure random six-digit OTP code, sends it to the requested phoneNumber,
 * and stores it in Redis for that user with a 2-minute TTL (storing in Redis is TODO).
 */
routes.post("/request-code", async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  // First, create a user if one doesn't already exist with this phoneNumber
  const { _id: id } = await User.findOneAndUpdate(
    { phoneNumber },
    { phoneNumber },
    { upsert: true, new: true }
  );

  // Then, generate a random OTP for this user
  const otp: string = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  // and set the OTP for this user (we'll use Redis for production)
  codes[id] = otp;

  // TODO: If NODE_ENV !== "development", actually send the code. For example,
  // if (requireEnvVar("NODE_ENV") !== 'development') smslib.send(`Welcome to ThoughtSheet. Your login code is 920183.`)

  console.log(id);

  return res.send({
    phoneNumber,
    message: "Code successfully sent.",
  });
});

/**
 * Handles the second step of the OTP code-based signup/signin flow.
 *
 * Checks the received six-digit OTP code against the one stored for
 * this `phoneNumber` in Redis (Redis is TODO). If correct, clears the
 * stored code and sends the user a signed JWT with their ID encoded
 * (we call this their token).
 *
 * This token allows them to be 'logged in': we check for it in
 * `middleware/auth.ts` and if it's found and it's valid, we set
 * req.user to the User object, so further route handlers can
 * access the currently logged-in user at `req.user`.
 */
routes.post("/submit-code", async (req: Request, res: Response) => {
  const { phoneNumber, code: otp } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (user == null) {
    throw new NotFoundError("A user with this phone number was not found.");
  }

  const expectedOtp = codes[user._id] || "";

  const valid = await bcrypt.compare(otp, await bcrypt.hash(expectedOtp, 5));

  console.log(`valid? ${valid}`);

  if (!valid) {
    return res.status(403).send({
      messsage: `Oh no, your code ${otp} wasn't valid.`,
    });
  }

  delete codes[user._id];

  // TODO(xtyrrell): v2: follow JWT best practices by expiring sooner, using a refresh token,
  // setting `audience` and other options
  const token = generateToken(user._id);
  return res.send({
    token,
    message: `You're in! Your JWT encoding your user id ${user._id} is ${token}`,
  });
});

/**
 * Logs in or signs up the user with this email and password using a JWT.
 *
 * Expects an email and password in the request body.
 *
 * If a user with the email in the request body already exists, responds
 * with a login token if the password they present is correct.
 *
 * If no user with that email exists, creates a new user and sets their
 * password to the password they've included in the request body.
 */
routes.post("/token/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(`logging in with email: ${email} and password ${password}`);

  const user = await User.findOne({ email });

  // If this user doesn't have an account yet,
  if (user == null) {
    console.log("about to create a new user " + email);

    // create their account
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(requireEnvVar("HASH_ROUNDS"))
    );
    const user = await User.create({ email, password: hashedPassword });

    // and log them in
    const token = generateToken(user._id);
    const message = `
    Created a new account for you! Your JWT encoding your user id is ${user._id} and token is
    ${token}
    `;

    console.log(message);

    return res.send({
      token,
      message,
    });
  }

  // If the user already exists, check password and log them in
  const valid = await bcrypt.compare(password, user.password);

  console.log(`valid password? ${valid}`);

  if (!valid) {
    return res.status(403).send({
      title: "Password invalid",
      message: `oh no, your password ${password} wasn't valid; we were expecting ${user.password}.`,
    });
  }

  const token = generateToken(user._id);
  return res.send({
    message: `You're in! Your JWT encoding your user id ${user._id} is ${token}`,
    token,
  });
});

/**
 * Logs in or signs up the user with this email and password using a cookie.
 *
 * Expects an email and password in the request body.
 *
 * If a user with the email in the request body already exists, responds
 * with a login cookie if the password they present is correct.
 *
 * If no user with that email exists, creates a new user and sets their
 * password to the one they provided.
 */
routes.post("/cookie/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(`logging in with email: ${email} and password ${password}`);

  const user = await User.findOne({ email });

  // If this user doesn't have an account yet,
  if (user == null) {
    console.log("about to create a new user " + email);

    // create their account
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(requireEnvVar("HASH_ROUNDS"))
    );
    const sessionId = uuid.v4();
    const user = await User.create({
      email,
      sessionId,
      password: hashedPassword,
    });

    // and log them in
    const message = `
    Created a new account for you! Your user ID is ${user._id} and session ID is ${sessionId},
    which has been encoded into a tamper-proof cookie we've given you.
    `;

    console.log(message);

    // we are rolling this ourself but in production should rather use express-session
    return res
      .cookie("sid", sessionId, {
        maxAge: parseInt(requireEnvVar("COOKIE_MAX_AGE")),
        signed: true,
        httpOnly: true,
        sameSite: "lax",
      })
      .send({
        message,
        user,
      });
  }

  // If the user already exists, check password and log them in
  const valid = await bcrypt.compare(password, user.password);

  console.log(`valid password? ${valid}`);

  if (!valid) {
    return res.status(403).send({
      title: "Password invalid",
      message: `oh no, your password ${password} wasn't valid; we were expecting ${user.password}.`,
    });
  }

  const token = generateToken(user._id);
  return res.send({
    message: `You're in! Your JWT encoding your user id ${user._id} is ${token}`,
    token,
  });
});

/**
 * Responds with the currently-logged-in user.
 *
 * Useful for debugging.
 */
routes.get("/whoami", authUser, async (req: Request, res: Response) => {
  return res.send({
    user: req.user,
  });
});

export default routes;
