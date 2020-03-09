const handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

const handle404 = (err, req, res, next) => {
  if (err.statusCode === 404) {
    res.status(err.statusCode).send(err.msg);
  } else next(err);
};

const handle400 = (err, req, res, next) => {
  if (err.message === "Unexpected field") {
    res.status(400).send({ msg: err.message });
  } else if (err.statusCode === 400) {
    res.status(err.statusCode).send({
      msg: err.message
    });
  } else next(err);
};

const handle500 = (err, req, res, next) => {
  console.log(err, "in 500");

  res.status(500).send({ msg: "Internal server error..." });
};

module.exports = { handle405, handle400, handle404, handle500 };
