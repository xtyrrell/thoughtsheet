import Router from 'express-promise-router'
import expressJwt from 'express-jwt'
import routes from './routes'

const router = Router()

router.use(
  '/notes',
  // TODO(xtyrrell): add audience; see https://github.com/auth0/express-jwt#additional-options
  expressJwt({ secret: process.env.SECRET as string, algorithms: ['HS256'], userProperty: 'userId' }), // TODO: change to "userToken"
  routes.notesRoutes,
  routes.notesRoutes
)

router.use(
  '/auth',
  routes.authRoutes,
  routes.authRoutes
)

// TODO(xtyrrell): add error handlers; see https://github.com/express-promise-router/express-promise-router#error-handling

export default router
