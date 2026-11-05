const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const categories = require("../utils/categories.js");

const defaultImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: defaultImage,
    },
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: categories.map((c) => c.name),
    default: "Trending",
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;