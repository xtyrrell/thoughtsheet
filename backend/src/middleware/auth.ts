import { NextFunction, Response } from "express";
import expressJwt from "express-jwt";
import User from "../models/user";
import requireEnvVar from "../utils/env";

export class AuthError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

// TODO(xtyrrell): add audience; see https://github.com/auth0/express-jwt#additional-options
/**
 * Middleware that sets `req.userToken` to the verified user JWT from the Authorization header.
 */
const requireUserToken = expressJwt({
  secret: requireEnvVar("SECRET"),
  algorithms: ["HS256"],
  userProperty: "userToken",
});

/**
 * Middleware that sets `req.user` to the User whose ID matches `req.userToken.id`.
 */
async function requireUser(req: any, res: Response, next: NextFunction) {
  const id = req.userToken?.id;
  if (!id) throw new AuthError("No token found.");

  const user = await User.findById(id).select("-password -__v");
  if (user == null) throw new AuthError("No user found.");

  // If this middleware succeeds, route handlers can get the current user
  // with `req.user`.
  req.user = user;

  next();
}

export default [requireUserToken, requireUser];
