import Router from 'express-promise-router'
import User from '../../models/user'

const routes = Router()

routes.get('/', async (req: any, res) => {
  console.log(req.user)

  // this should be populated by the auth/user middleware
  const user = await User.findById(req.userId.id)

  res.json(user.phoneNumber) // or user.notes or whatever

  // res.json([{
  //   id: 1,
  //   title: "Why I Will Die if My Noodle Soup is Ever Withheld from Me",
  //   body: "Well, the whole story starts..."
  // }])
})

export default routes
