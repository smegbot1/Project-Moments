const endpoints = require("../endpoints.json");

getAllEndpoints = (req, res, next) => {
  return res.status(200).send(endpoints);
};

module.exports = { getAllEndpoints };
