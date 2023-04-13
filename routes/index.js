var express = require("express");
var router = express.Router();

const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/login", authController.login_get);
router.get("/signUp", authController.signUp_get);
router.get("/newMessage", messageController.newMessage_get);
router.get("/secretPassword", authController.secretPassword_get);

module.exports = router;
