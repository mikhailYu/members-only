const Message = require("../models/message");
var bcrypt = require("bcryptjs");
const User = require("../models/user");
const async = require("async");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var app = require("../app");
const { body, check, validationResult } = require("express-validator");

const secretCode = "odin";

exports.login_get = (req, res, next) => {
  res.render("login", { title: "Login" });
};

exports.signUp_get = (req, res, next) => {
  res.render("signUp", { title: "SignUp" });
};

exports.signUp_post = [
  body("first_nameInput")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified."),
  body("last_nameInput")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified."),
  body("emailInput")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must be specified."),
  body("passwordInput")
    .isLength({ min: 1 })
    .withMessage("Password must be specified."),
  body("confirmPasswordInput").isLength({ min: 1 }),
  check("passwordInput").exists(),
  check("confirmPasswordInput", "Passwords must match")
    .exists()
    .custom((value, { req }) => value === req.body.passwordInput),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signUp", {
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.
    bcrypt.hash(req.body.passwordInput, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const user = new User({
          first_name: req.body.first_nameInput,
          last_name: req.body.last_nameInput,
          password: hashedPassword,
          email: req.body.emailInput,
          admin: req.body.adminSelect,
          approved: false,
        });

        user
          .save()
          .then(() => {
            res.redirect("/login");
          })
          .catch((err) => {
            return next(err);
          });
      }
    });
  },
];

exports.secretPassword_get = (req, res, next) => {
  res.render("secretPassword", { user: req.user });
};

exports.secretPassword_post = async (req, res) => {
  if (!req.user) {
    return;
  }

  if (req.body.secretPasswordInput == secretCode) {
    const user = new User({
      approved: true,
      _id: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, user);
    res.redirect("/");
  } else {
    res.render("secretPassword", { user: req.user, error: true });
  }
};
