import Router from 'express-promise-router'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Request, Response } from 'express'
import User from '../../models/user'

const routes = Router()

// TODO(xtyrrell): v1: use Redis with TTLs rather
const codes: any = {}

routes.post('/request-code', async (req: Request, res: Response) => {
  // generates a secure random six-digit OTP code,
  // sends it to the requested phoneNumber,
  // and stores it in Redis with a 2-minute TTL

  const { phoneNumber } = req.body

  // First, create a user if one doesn't already exist with this phoneNumber
  const { _id: id } = await User.findOneAndUpdate({ phoneNumber }, { phoneNumber }, { upsert: true, new: true })

  // Then, generate a random OTP for this user
  const otp: string = crypto.randomInt(0, 1000000).toString().padStart(6, '0')
  // and set the OTP for this user (we'll use Redis for production)
  codes[id] = otp

  console.log(id)

  res.send(`generating and sending a code ${otp} to ${phoneNumber}`)
})

routes.post('/submit-code', async (req: Request, res: Response) => {
  // checks the received six-digit OTP code against the one stored for
  // this phoneNumber in Redis. If correct, sends the user a signed JWT
  // with their id encoded

  const { phoneNumber, code: otp } = req.body

  // First, create a user if one doesn't already exist with this phoneNumber
  const { _id: id } = await User.findOne({ phoneNumber })

  const expectedOtp = codes[id] || ''

  const valid = await bcrypt.compare(otp, await bcrypt.hash(expectedOtp, 5))

  console.log(`valid? ${valid}`)

  if (!valid) {
    res.send(`oh no, you're code ${otp} wasn't valid; we were expecting ${expectedOtp}.`)
    return
  }

  delete codes[id]

  // TODO(xtyrrell): v2: follow JWT best practices by expiring sooner, using a refresh token,
  // setting `audience` and other options
  const token = jwt.sign({ id }, process.env.SECRET as string, { expiresIn: '60d' })
  res.send(`You're in! Your JWT encoding your user id ${id} is ${token}`)
})

export default routes
