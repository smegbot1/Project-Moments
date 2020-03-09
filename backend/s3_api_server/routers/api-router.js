const apiRouter = require("express").Router();
const imageRouter = require("./image-router");
const { getAllEndpoints } = require("../controllers/apiController");

apiRouter.get("/", getAllEndpoints);

apiRouter.use("/upload", imageRouter);

module.exports = apiRouter;
