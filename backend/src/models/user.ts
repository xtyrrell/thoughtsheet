import mongoose, { Document, Schema } from 'mongoose'
import validator from 'validator'
import { INote } from './note'

export interface IUser extends Document {
  phoneNumber: string,
  email: string,
  password: string,
  notes: [INote]
}

const userSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
    unique: true,
    validate: validator.isMobilePhone
  },
  email: {
    type: String,
    unique: true,
    validate: validator.isEmail
  },
  password: String,
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
 }]
}, { timestamps: true })

const User = mongoose.model<IUser>('User', userSchema)

export default User
