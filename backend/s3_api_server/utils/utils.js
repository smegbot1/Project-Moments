const path = require("path");

const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb({ status: 400, msg: "File type must be jpeg|jpg|png" });
  }
};

module.exports = { checkFileType };
