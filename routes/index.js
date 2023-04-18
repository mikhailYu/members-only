var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const User = require("../models/user");

const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const allMessages = await Message.find({}, "title text date user")
    .sort({ date: 1 })
    .populate("user")
    .exec();
  const user = () => {
    if (req.user) {
      return req.user;
    } else {
      return false;
    }
  };

  res.render("index", { user: req.user, messages: allMessages });
});
router.get("/login", authController.login_get);

router.get("/signUp", authController.signUp_get);
router.post("/signUp", authController.signUp_post);

router.get("/secretPassword", authController.secretPassword_get);
router.post("/secretPassword", authController.secretPassword_post);

router.get("/newMessage", messageController.newMessage_get);
router.post("/newMessage", messageController.newMessage_post);

router.get("/", messageController.message_get);
router.get("/", messageController.message_delete_get);
router.post("/deleteMessage", messageController.message_delete_post);

module.exports = router;
