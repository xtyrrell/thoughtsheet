import { Errback, NextFunction, Request, Response } from "express";
import mongoose, { mongo } from "mongoose";

export class NotFoundError extends Error {
  status: number = 404;

  constructor(message = "Not found") {
    super();
    this.message = message;
  }
}

// TODO(xtyrrell): v1: Implement proper error handling; properly account for all errors that could be
// thrown in route handlers
export async function errorHandler(
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  console.error("Oh no, error encountered!");
  console.error(err);

  if (err instanceof NotFoundError) {
    return res.status(err.status).send(err.message);
  }

  if (err instanceof mongoose.Error) {
    return res.status(500).send("Mongoose error");
  }

  res.sendStatus(500);
}
