import { NextFunction, Request, Response } from 'express'
import User from '../models/user'

export async function requireUser (req: Request, res: Response, next: NextFunction) {
  const id = req.user?.id

  if (!id) throw new Error("Authentication required: Please attach a Authorization header with value 'Bearer jwt' where jwt is a valid JWT from this server.")

  const user = await User.findById(id)
  req.userObject = user // TODO: Modify express-jwt to rather set req.userId, and we'll set req.user here.

  next()
}
