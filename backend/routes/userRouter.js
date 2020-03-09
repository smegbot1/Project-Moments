const userRouter = require("express").Router();
const { handle405 } = require("../errors/errors");
const { createUser } = require("../controllers/user-controller");

userRouter
  .route("/")
  .post(createUser)
  .all(handle405);

module.exports = userRouter;
