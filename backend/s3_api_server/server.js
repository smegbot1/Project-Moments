const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRouter = require("./routers/api-router");
const router = express.Router();
const { handle404, handle400, handle500 } = require("./errors");
const { PORT = 9090 } = process.env;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use(handle404);
app.use(handle400);
app.use(handle500);

app.listen(PORT);
module.exports = { router, app };
