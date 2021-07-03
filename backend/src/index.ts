import mongoose from "mongoose";
import app from "./app";
import requireEnvVar from "./utils/env";

async function main() {
  const PORT = requireEnvVar("PORT");
  const MONGO_URL = requireEnvVar("MONGO_URL", "mongodb://localhost");

  console.log("Starting server...");
  console.log(
    `Awaiting connection to a MongoDB instance at MONGO_URL: ${MONGO_URL}...`
  );

  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch {
    console.error("Mongoose could not connect to MongoDB server. Exiting.");
    process.exit(1);
  }

  // Start the express server
  app.listen(PORT, () => {
    console.log(
      `Connection to MongoDB successful. Now listening on port ${PORT}.`
    );
  });
}

main();
