const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { cloudinary } = require("./config/cloudinary.js");
const {
  listingSchema,
  reviewSchema,
  userSchema,
} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }

    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
};



module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
});


module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review you requested does not exist!");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
});


const makeValidator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const message = error.details
      .map((el) => el.message)
      .join(", ");

    throw new ExpressError(400, message);
  }

  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    if (req.file) {
      cloudinary.uploader.destroy(req.file.filename).catch(() => {});
    }

    const message = error.details
      .map((el) => el.message)
      .join(", ");

    throw new ExpressError(400, message);
  }

  next();
};

module.exports.validateReview = makeValidator(reviewSchema);
module.exports.validateUser = makeValidator(userSchema);
