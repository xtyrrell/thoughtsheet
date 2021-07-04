import express from "express";
import cors from "cors";
import router from "./router";
import morgan from "morgan";

const app = express();

app.use(morgan("combined") as any);

// app.use(cors({ origin: /localhost(?:\:[0-9]{1,4})?$/i, credentials: true }));
// app.use(cors({ credentials: true }));
app.use(cors({ origin: /localhost:3000$/i, credentials: true }));

app.use(express.json() as any); // for parsing application/json
app.use(express.urlencoded({ extended: true }) as any); // for parsing application/x-www-form-urlencoded

app.use(router);

export default app;
