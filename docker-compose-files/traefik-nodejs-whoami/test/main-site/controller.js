// @ts-check
const { Order } = require("./model/order.js");
const { Contact } = require("./model/contact.js");

/**@type{import('express').RequestHandler} */
exports.createContactForm = (req, res, next) => {
  Contact.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    title: req.body.title,
    filePath: req.files.map((file) => file.path),
    message: req.body.message,
  })
    .then((val) => {
      console.log("hellow:");
      console.log(val);
      res.status(201).json({
        success: true,
        message: "Contact form sent!",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createOrder = (req, res, next) => {
  Order.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    description: req.body.description,
    filePath: req.files.map((file) => file.path),
  })
    .then((val) => {
      console.log("hellow:");
      console.log(val);
      res.status(201).json({
        success: true,
        message: "Order created",
      });
    })
    .catch((err) => {
      next(err);
    });
};
