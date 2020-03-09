const activeUserRouter = require("express").Router();
const { handle405 } = require("../errors/errors");
const { changeActiveUser } = require("../controllers/user-controller");

activeUserRouter
  .route("/")
  .patch(changeActiveUser)
  .all(handle405);

module.exports = activeUserRouter;
