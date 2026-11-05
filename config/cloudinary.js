const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const ExpressError = require("../utils/ExpressError.js");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust",
    allowed_formats: ["png", "jpg", "jpeg", "webp"],
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ExpressError(400, "Only image files are allowed!"));
    }
  },
});


const DEFAULT_FILENAME = "listingimage";

const deleteImage = async (filename) => {
  if (!filename || filename === DEFAULT_FILENAME) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(filename);
  } catch (err) {
    // a failed clean-up should not break the request
    console.log("Could not delete image from Cloudinary:", err.message);
  }
};

module.exports = { cloudinary, upload, deleteImage };