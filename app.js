// Load the secrets from the .env file when working on our own computer.
// On Render the same values are set in the dashboard instead.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ quiet: true });
}
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const categories = require("./utils/categories.js");
const ExpressError = require("./utils/ExpressError.js");

// Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieRouter = require("./routes/cookies.js");
const demoRouter = require("./routes/demo.js");

const isProduction = process.env.NODE_ENV === "production";

// Atlas on the internet, or local MongoDB when working on our own computer
const dbUrl = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";
const PORT = process.env.PORT || 8080;

// One secret used for signing cookies and the session
const SECRET = process.env.SECRET || "mysupersecretcode";

if (isProduction && !process.env.SECRET) {
  throw new Error("SECRET must be set in production!");
}

// Database Connection
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// App Configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Render (and most hosts) put a proxy in front of the app. This lets Express
// know the real request was https, which secure cookies need.
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Cookie parser (the secret makes signed cookies possible)
app.use(cookieParser(SECRET));

// Default values so every ejs file can safely use these
app.use((req, res, next) => {
  res.locals.success = [];
  res.locals.error = [];
  res.locals.currentUser = null;
  res.locals.categories = categories;
  res.locals.q = "";
  res.locals.category = "";
  next();
});

// Sessions are stored in MongoDB, so users stay logged in even after the
// server restarts (the default memory store forgets everything).
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // update an unchanged session at most once a day
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session settings
const sessionOptions = {
  store,
  secret: SECRET, // used to sign the session id cookie
  resave: false, // do not save the session again if nothing changed
  saveUninitialized: false, // do not create a session for visitors who store nothing
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie lives for 7 days
    httpOnly: true, // JavaScript in the browser cannot read this cookie
    sameSite: "lax",
    secure: isProduction, // only send the cookie over https on the real site
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport (login system) must come after the session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages and the logged in user available in every ejs file
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Root Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Use the routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Learning demos (not available in production)
if (!isProduction) {
  app.use("/cookies", cookieRouter);
  app.use("/demo", demoRouter);
}

// If no route matches -> 404
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Custom error handler
app.use((err, req, res, next) => {
  // a wrong id format (like /listings/abc) gives a CastError
  if (err.name === "CastError") {
    err = new ExpressError(404, "Listing not found!");
  }

  // problems while uploading an image
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "The image must be smaller than 5 MB!"
        : err.message;
    err = new ExpressError(400, message);
  } else if (err.http_code) {
    err = new ExpressError(400, `Image upload failed: ${err.message}`);
  }

  const { statusCode = 500, message = "Something went wrong!" } = err;

  // show unexpected errors in the terminal / Render logs
  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).render("error.ejs", { statusCode, message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});