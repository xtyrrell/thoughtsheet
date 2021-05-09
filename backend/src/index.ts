import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app'

async function main () {
  const PORT = process.env.PORT ?? 8080

  await mongoose.connect(process.env.MONGO_URL ?? 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

  // Start the express server
  app.listen(PORT, () => {
    console.log(`Express server listening on port http://localhost:${PORT}.`)
  })
}

main()
