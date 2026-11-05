const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const categories = require("../utils/categories.js");
const geocode = require("../utils/geocode.js");
const { deleteImage } = require("../config/cloudinary.js");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.index = async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const requestedCategory =
    typeof req.query.category === "string" ? req.query.category : "";
  const category = categories.some((c) => c.name === requestedCategory)
    ? requestedCategory
    : "";

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (q) {
    const regex = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: regex }, { location: regex }, { country: regex }];
  }

  const allListings = await Listing.find(filter);

  let lastViewed = null;
  const lastId = req.signedCookies.lastViewed;

  if (lastId && mongoose.isValidObjectId(lastId)) {
    lastViewed = await Listing.findById(lastId).select("title");
  }

  res.render("listings/index.ejs", { allListings, q, category, lastViewed });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.cookie("lastViewed", listing._id.toString(), {
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }

  const geometry = await geocode(newListing.location, newListing.country);

  if (geometry) {
    newListing.geometry = geometry;
  } else {
    req.flash(
      "error",
      "Listing saved, but we could not find its place on the map. Check the location and country spelling."
    );
  }

  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  const data = req.body.listing;
  const placeChanged =
    listing.location !== data.location || listing.country !== data.country;

  listing.set(data);

  // look up the map position again only when the place changed (or is missing)
  const hasCoordinates =
    listing.geometry &&
    listing.geometry.coordinates &&
    listing.geometry.coordinates.length === 2;

  if (placeChanged || !hasCoordinates) {
    const geometry = await geocode(listing.location, listing.country);
    listing.geometry = geometry || { coordinates: [] };

    if (!geometry) {
      req.flash(
        "error",
        "Listing saved, but we could not find its place on the map. Check the location and country spelling."
      );
    }
  }

  const oldFilename = listing.image.filename;

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }

  await listing.save();

  if (req.file) {
    await deleteImage(oldFilename);
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  if (listing) {
    await deleteImage(listing.image.filename);
  }

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};