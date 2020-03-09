const { updateDB, getAllImages, deleteFromDB } = require("../models/image-model");

const uploadDBInfo = (req, res, next) => {
  const { imageLocation, usr } = req.body;

  updateDB(imageLocation, usr)
    .then(() => {
      res.status(201).send({
        msg: "success DB update"
      });
    })
    .catch(next);
};

const fetchAllImages = (req, res, next) => {
  const { usr } = req.params;

  getAllImages(usr)
    .then(
      ({
        data: {
          Item: { picURL }
        }
      }) => {
        res.status(200).send({ images: picURL });
      }
    )
    .catch(next);
};

const removeImage = (req, res, next) => {
  const { usr } = req.params;
  const { url } = req.body;
  deleteFromDB(usr, url)
    .then(deleted => {
      res.status(200).send({ msg: "url has been deleted from this user" });
    })
    .catch(next);
};

module.exports = { uploadDBInfo, fetchAllImages, removeImage };
