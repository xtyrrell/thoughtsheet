import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface INote extends Document {
  userId: IUser["_id"];
  title: string;
  body: string;
  tags: [string];
}

const noteSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
      default: "",
    },
    tags: [String],
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
