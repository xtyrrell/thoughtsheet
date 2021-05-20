import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import { INote } from "./note";

export interface IUser extends Document {
  phoneNumber: string;
  email: string;
  password: string;
  /**
   *  A unique identifier for this user's current session (if any). This is
   *  the reference we store in a session cookie / JWT. The reason we store
   *  this instead of just this user's ID is that this allows us to easily
   *  revoke a user's session just by deleting a user's `sessionId`. It only
   *  requires one database lookup, which will be fast given that this field
   *  is indexed, so is in all other ways identical to using the user's ID.
   */
  sessionId?: string;
  notes: [INote];
}

const userSchema: Schema = new Schema(
  {
    phoneNumber: {
      type: String,
      // unique: true,
      validate: validator.isMobilePhone,
    },
    email: {
      type: String,
      // unique: true,
      validate: validator.isEmail,
      index: true,
    },
    password: {
      type: String,
    },
    sessionId: {
      type: String,
      index: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

User.createIndexes();

export default User;
