import Router from "express-promise-router";
import Note, { INote } from "../models/note";
import { NotFoundError } from "../middleware/errors";
import mongoose from "mongoose";

const routes = Router();

const myNotes = (userId: mongoose.Types.ObjectId) => Note.find({ userId });

routes.post("/", async (req: any, res) => {
  // TODO: Add authentication and get req.user from the actual request
  // const noteData = { ...req.body, userId: req.user._id };
  const noteData = { ...req.body };

  console.log("Creating new note: ", noteData);
  res.send(await Note.create(noteData));
});

routes.get("/", async (req: any, res) => {
  // TODO: Add auth
  // return res.send(await myNotes(req.user._id).exec());
  return res.send(await Note.find({}).sort({ createdAt: -1 }).exec());
});

// TODO(xtyrrell): v0: remove
routes.get("/all", async (req: any, res) => {
  return res.send(await Note.find());
});
routes.get("/delete-all", async (req: any, res) => {
  return res.send(await Note.deleteMany());
});

routes.get("/:noteId", async (req: any, res) => {
  let note: INote | null;

  try {
    // TODO:AUTH
    // note = await myNotes(req.user._id).findOne({ _id: req.params.noteId });
    note = await Note.findById(req.params.noteId);
  } catch (err) {
    throw new NotFoundError();
  }

  if (note == null) throw new NotFoundError();

  res.send(note);
});

routes.delete("/:noteId", async (req: any, res) => {
  let note: INote | null;

  try {
    note = await myNotes(req.user._id).findByIdAndDelete(req.params.noteId);
  } catch (err) {
    // TODO: v1: inspect this error and provide a better reason to the client
    throw new NotFoundError();
  }

  if (note == null) throw new NotFoundError();

  res.send(note);
});

routes.patch("/:noteId", async (req: any, res) => {
  let note: INote | null;

  console.log("updated");

  try {
    console.log("the note about to be updated:");
    // console.log(await myNotes(req.user._id).find({ _id: req.params.noteId }));
    console.log(await Note.find({ _id: req.params.noteId }));

    // TODO(xtyrrell): v0: don't allow users to transfer notes to other users by setting userId in
    // req.body
    // note = await myNotes(req.user._id).findOneAndUpdate(
    note = await Note.findOneAndUpdate({ _id: req.params.noteId }, req.body, {
      new: true,
    });

    // This is a bit gross: we're creating a note with this ID if it doesn't exist
    // This is so that the frontend can choose the ID for new notes, avoiding the user
    // having to wait for a network call before being able to edit the new note they want to make
    if (note == null) {
      // TODO: Add authentication and get req.user from the actual request
      // const noteData = { ...req.body, req.params.noteId, userId: req.user._id };
      const noteData = { ...req.body, _id: req.params.noteId };

      console.log("Creating new note: ", noteData);
      note = await Note.create(noteData);
      console.log("Createdddddd new note: ", note);
    }
  } catch (err) {
    console.log("not throwing err");
    // throw err;
    // throw new NotFoundError()
    note = null;
  }

  if (note == null) throw new NotFoundError();

  res.send(note);
});

export default routes;
