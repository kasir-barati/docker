// @ts-check
const express = require("express");
const { MulterError } = require("multer");
const { ValidationError } = require("sequelize");
const cors = require("cors");

const router = require("./routes.js");
const { sequelize } = require("./model/db-config.js");
require("./model/user.js");
require("./model/order.js");
require("./model/contact.js");

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json()); // application/json
app.use("/", router);

/**@type {import('express').ErrorRequestHandler} */
function errorHandler(err, req, res, next) {
  if (err.name === "MulterError") {
    res.status(422).json({
      success: false,
      message: "bad input file:" + err,
    });
  } else if (err instanceof ValidationError) {
    res.status(422).json({
      success: false,
      message: "bad input form data",
    });
  } else {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}

app.use(errorHandler);

sequelize
  .sync({ force: process.env.NODE_ENV === "development" ? true : false })
  //.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
