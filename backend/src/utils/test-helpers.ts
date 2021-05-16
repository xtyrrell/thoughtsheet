import { beforeEach, afterEach, test, expect } from "@jest/globals"
import mongoose from 'mongoose'
import requireEnvVar from "./env"

export function setupDatabase(): void {
  beforeEach(async() => {
    try {
      await mongoose.connect(requireEnvVar('MONGO_URL', 'mongodb://localhost'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
    } catch (err) {
      console.error(`Mongoose could not connect to MongoDB server. Exiting.`)
      console.error(`Error details: ${err}`)
      process.exit(1)
    }

    if (mongoose?.connection?.db?.databaseName !== "test") {
      console.error(`Oh no, we didn't manage to connect to the test database.`)
      console.error(`mongoose?.connection?.db: ${mongoose?.connection?.db}`)
      throw new Error("Wait stop testing, for some reason we didn't connect to the `test` database! As a safety measure, this is an error.")
    }
  })

  afterEach(async () => {
    await mongoose.disconnect()
  })

  test("can connect to mongo db", async () => {
    const pingResponse = await mongoose.connection.db.command({ ping: 1 })
    expect(pingResponse).toHaveProperty("ok", 1)
  })
}
