import mongoose from 'mongoose'
import app from './app'
import requireEnvVar from './utils/env'

async function main () {
  const PORT = requireEnvVar('PORT')

  try {
    await mongoose.connect(requireEnvVar('MONGO_URL', 'mongodb://localhost'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
  } catch {
    console.error(`Mongoose could not connect to MongoDB server. Exiting.`)
    process.exit(1)
  }

  // Start the express server
  app.listen(PORT, () => {
    console.log(`Express server listening on port http://localhost:${PORT}.`)
  })
}

main()
