// @ts-check
const sanitize = require("sanitize-filename");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "".concat(
        file.fieldname,
        "_",
        new Date().toISOString(),
        "_",
        sanitize(file.originalname),
      ),
    );
  },
});

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  // removed option
  // onError: function (err, next) {
  //   next(err);
  // },
});
