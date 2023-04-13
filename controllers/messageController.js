// const Genre = require("../models/genre");
// const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.newMessage_get = (req, res, next) => {
  res.render("newMessage", { title: "Login" });
};
