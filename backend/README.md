# thoughtsheet-backend

The Node.js Express backend for Thoughtsheet: simple cloud-synced multiplatform notes app.

It uses Express and MongoDB with Mongoose, and is written in TypeScript.

## Getting started

To get the backend server up and running locally follow these steps.

### Prerequisites

* You'll need a recent version of **Node.js** installed (the exact version is in `.tool-versions`). I recommend using [asdf](https://asdf-vm.com/#/core-manage-asdf) to easily install and manage multiple versions, but any installation method should work.
* You can install **Docker** if you'd like to run a local MongoDB without installing: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/). You will want to add yourself to the `docker` group so `docker` commands don't require `sudo`, see the [postinstall steps](https://docs.docker.com/engine/install/linux-postinstall/). Then you can set the `MONGO_URL` environment variable in your `.env` file to your local MongoDB connection string URL to use as your development database.
* Or, you can install **MongoDB** directly: https://docs.mongodb.com/manual/installation/

### Installation

1. Ask someone for the environment variables, and fill them into a copy of `.env.example` named `.env`.
  ```sh
  cp .env.example .env
  code .env
  # now paste in the secrets!
  ```

2. Install dependencies.
  ```sh
  npm i
  ```

3. Start the server in development mode (it uses `nodemon` to auto-restart after you make changes).
  ```sh
  npm run dev
  ```

4. Get coding!

5. Optionally, run tests in watch mode to code in a TDD style.
  ```sh
  npm run test:watch
  ```

## Testing

We're using
* Jest as our testing framework
* Supertest for integration testing

The tests are in `src/tests/`. There are no unit tests yet, but it will be easy to start making some; you are encouraged to do so.

We are using the `@shelf/jest-mongodb` Jest preset, which spins up a local, in-memory MongoDB server and automatically sets the `MONGO_URL` environment variable to that in-memory server. To connect to this database in tests, simply import and call `setupDatabase()` from `src/utils/test-helpers.ts`, and then use your models as normal, like so:

```ts
import User from '../models/User'
import { setupDatabase } from "../utils/test-helpers"

setupDatabase()

test("can create a user", async () => {
  expect(await User.create({ ... })).toHaveProperty('_id')
})
```
