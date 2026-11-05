// Run with: npm run seed
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ quiet: true });
}
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const categories = require("../utils/categories.js");
const { data } = require("./data.js");

const dbUrl = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";
const valid = categories.map((c) => c.name);

// Keyword in the title -> category names to try (first one that exists in your list wins)
const rules = [
  [/beach|island|bungalow/i, ["Beach", "Beaches", "Islands"]],
  [/castle/i, ["Castles", "Castle"]],
  [/pool|maldives|oasis/i, ["Amazing Pools", "Pools", "Beach"]],
  [/treehouse/i, ["Treehouse", "Treehouses", "Camping"]],
  [/ski|chalet/i, ["Arctic", "Mountains"]],
  [/mountain|cabin|retreat/i, ["Mountains", "Mountain", "Camping"]],
  [/safari|lodge|camp|lake/i, ["Camping", "Farms"]],
  [/loft|apartment|penthouse|downtown|city|canal|brownstone/i, ["Iconic Cities", "Cities", "Rooms"]],
];

function pickCategory(listing, index) {
  for (const [rx, names] of rules) {
    if (rx.test(listing.title)) {
      const found = names
        .map((n) => valid.find((v) => v.toLowerCase() === n.toLowerCase()))
        .find(Boolean);
      if (found) return found;
    }
  }
  return valid[index % valid.length]; // fallback so validation never fails
}

(async () => {
  await mongoose.connect(dbUrl);
  console.log("connected to:", mongoose.connection.host);

  let owner = await User.findOne({ username: "demo" });
  if (!owner) {
    owner = await User.register(
      new User({ username: "demo", email: "demo@example.com" }),
      "demo123"
    );
  }

  await Listing.deleteMany({});
  await Listing.insertMany(
    data.map((d, i) => ({
      ...d,
      image: typeof d.image === "string" ? { url: d.image, filename: "seed" } : d.image,
      category: valid.includes(d.category) ? d.category : pickCategory(d, i),
      owner: owner._id,
    }))
  );

  console.log(`Seeded ${data.length} listings. Demo login -> demo / demo123`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
