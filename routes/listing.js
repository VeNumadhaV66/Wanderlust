const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings.js");
const { upload } = require("../config/cloudinary.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// /listings
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New form (must stay above "/:id", otherwise "new" would be read as an id)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// /listings/:id
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// /listings/:id/edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;