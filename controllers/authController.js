// const Genre = require("../models/genre");
// const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.login_get = (req, res, next) => {
  res.render("login", { title: "Login" });
};

exports.signUp_get = (req, res, next) => {
  res.render("signUp", { title: "SignUp" });
};

exports.secretPassword_get = (req, res, next) => {
  res.render("secretPassword", { title: "Secret Password" });
};
