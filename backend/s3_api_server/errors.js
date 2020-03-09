const handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

const handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.statusCode === 404) {
    res.status(err.statusCode).send({ msg: err.message });
  } else next(err);
};

const handle400 = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: err.msg });
  } else if (err.message === "Unexpected field") {
    res.status(400).send({ msg: err.message });
  } else if (err.statusCode === 400) {
    res.status(err.statusCode).send({
      msg: err.message,
      description: "this error may  indicate that the user does not exist in database"
    });
  } else next(err);
};

const handle500 = (err, req, res, next) => {
  console.log(err, "in 500");

  res.status(500).send({ msg: "Internal server error..." });
};

module.exports = { handle405, handle400, handle404, handle500 };
