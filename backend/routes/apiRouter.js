const apiRouter = require("express").Router();
const { getAllEndpoints } = require("../controllers/api-controller");
const imageRouter = require("./imageRouter");
const userRouter = require("./userRouter");
const activeUserRouter = require("./activeUserRouter");
const { handle405 } = require("../errors/errors");

apiRouter
  .route("/")
  .get(getAllEndpoints)
  .all(handle405);

apiRouter.use("/upload", imageRouter);
apiRouter.use("/images", imageRouter);
apiRouter.use("/createuser", userRouter);
apiRouter.use("/activeuser", activeUserRouter);

module.exports = apiRouter;
