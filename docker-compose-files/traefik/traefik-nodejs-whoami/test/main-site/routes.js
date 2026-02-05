const express = require("express");
const utils = require("./util.js");

const Controller = require("./controller.js");

const router = express.Router();

router.get("/handshake", (req, res, next) => {
  res.status(200).json({ status: "healthy" });
});

router.post(
  "/contact",
  utils.upload.array("contactFile"),
  Controller.createContactForm,
);

router.post(
  "/order/reg",
  utils.upload.array("orderFile"),
  Controller.createOrder,
);

module.exports = router;
