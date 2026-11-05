const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
    <h2>Wanderlust Demo</h2>
    <p>Your Express demo route is working.</p>
    <p><a href="/">Return to Wanderlust</a></p>
  `);
});

module.exports = router;
