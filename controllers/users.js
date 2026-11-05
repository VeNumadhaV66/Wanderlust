const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;

    const newUser = new User({ email, username });
    // register() hashes the password with a random salt and saves the user
    const registeredUser = await User.register(newUser, password);

    // login right after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    const message =
      err.code === 11000 ? "A user with this email already exists." : err.message;

    req.flash("error", message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  
  const target = req.query.next;

  if (typeof target === "string" && target.startsWith("/") && !target.startsWith("//")) {
    req.session.redirectUrl = target;
  }

  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");

  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};