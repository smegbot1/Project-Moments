const { createUserInDB, updateActiveUser } = require("../models/user-model");

const createUser = (req, res, next) => {
  const { usr } = req.body;
  createUserInDB(usr)
    .then(() => {
      res.status(201).send({ msg: `${usr} account created in DB` });
    })
    .catch(next);
};

const changeActiveUser = (req, res, next) => {
  const { usr } = req.body;
  updateActiveUser(usr)
    .then(() => {
      res.status(201).send({ msg: "Active user changed" });
    })
    .catch(next);
};

module.exports = { createUser, changeActiveUser };
