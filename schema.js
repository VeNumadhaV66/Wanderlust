// Server side validation rules for a listing (using Joi).
const Joi = require("joi");
const categories = require("./utils/categories.js");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    category: Joi.string()
      .valid(...categories.map((c) => c.name))
      .required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().min(3).max(500).required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(100).required(),
  }).required(),
});