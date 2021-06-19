import Router from "express-promise-router";
import routes from "./controllers";
import authUser from "./middleware/auth";
import { errorHandler } from "./middleware/errors";

const router = Router();

// router.use("/notes", authUser, routes.notesRoutes);
router.use("/notes", routes.notesRoutes);

router.use("/auth", routes.authRoutes);

// TODO(xtyrrell): add error handlers; see https://github.com/express-promise-router/express-promise-router#error-handling
router.use("*", errorHandler);

export default router;
