import Router from 'express-promise-router'
import Note, { INote } from '../models/note'
import { NotFoundError } from '../middleware/errors'
import mongoose from 'mongoose'

const routes = Router()

const myNotes = (userId: mongoose.Types.ObjectId) => Note.find({ userId })

routes.post('/', async (req: any, res) => {
  const noteData = { ...req.body, userId: req.user._id }
  console.log(`Creating new note: `, noteData)
  res.send(await Note.create(noteData))
})

routes.get('/', async (req: any, res) => {
  return res.send(await myNotes(req.user._id).exec())
})

// TODO(xtyrrell): v0: remove
routes.get('/all', async (req: any, res) => {
  return res.send(await Note.find())
})
routes.get('/delete-all', async (req: any, res) => {
  return res.send(await Note.deleteMany())
})

routes.get('/:noteId', async (req: any, res) => {
  let note: INote | null

  try {
    note = await myNotes(req.user._id).findOne({ _id: req.params.noteId })
  } catch (err) {
    throw new NotFoundError()
  }

  if (!note) throw new NotFoundError()

  res.send(note)
})

routes.delete('/:noteId', async (req: any, res) => {
  let note: INote | null

  try {
    note = await myNotes(req.user._id).findByIdAndDelete(req.params.noteId)
  } catch (err) {
    // TODO: v1: inspect this error and provide a better reason to the client
    throw new NotFoundError()
  }

  if (!note) throw new NotFoundError()

  res.send(note)
})

routes.patch('/:noteId', async (req: any, res) => {
  let note: INote | null

  console.log('the note about to be updated:')
  console.log(await myNotes(req.user._id).find({ _id: req.params.noteId }))

  try {
    // TODO(xtyrrell): v0: don't allow users to transfer notes to other users by setting userId in
    // req.body
    note = await myNotes(req.user._id).findOneAndUpdate({ _id: req.params.noteId }, req.body)
  } catch (err) {
    throw err
    // throw new NotFoundError()
  }

  if (!note) throw new NotFoundError()

  res.send(note)
})
  
export default routes