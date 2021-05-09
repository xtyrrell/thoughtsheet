import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  phoneNumber: String
})

const User = mongoose.model('User', userSchema)

export default User
