require("dotenv").config();

var bcrypt = require("bcryptjs");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { body, check, validationResult } = require("express-validator");

const User = require("./models/user");

var indexRouter = require("./routes/index");

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("strictQuery", false);
const mongoDB = process.env.mongoDB_connection;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

passport.use(
  new LocalStrategy(
    {
      usernameField: "emailLoginInput",
      passwordField: "passwordLoginInput",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          console.log("Wrong email");
          return done(null, false, { message: "Incorrect email" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user);
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" });
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
