const Message = require("../models/message");
const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");
const user = require("../models/user");

exports.newMessage_get = (req, res, next) => {
  res.render("newMessage", { user: req.user });
};

exports.newMessage_post = [
  body("messageTitleInput", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("messageTextInput", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    var newDate = new Date();
    const message = new Message({
      title: req.body.messageTitleInput,
      text: req.body.messageTextInput,
      date: newDate,
      user: req.user,
    });
    if (!errors.isEmpty()) {
      res.render("newMessage", { user: req.user, errors: errors.array() });
      return;
    } else {
      await message.save();
      res.redirect("/");
    }
  },
];

exports.message_get = (req, res) => {
  res.send("NOT IMPLEMENTED: message_get");
};
exports.message_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: message_delete_get");
};
exports.message_delete_post = async (req, res, next) => {
  const messageID = req.body.messageID;
  await Message.findByIdAndRemove(messageID);

  res.redirect("/");
};
