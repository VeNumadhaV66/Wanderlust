
const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");
const { saveRedirectUrl, validateUser } = require("../middleware.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(validateUser, wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.post("/logout", userController.logout);

module.exports = router;
