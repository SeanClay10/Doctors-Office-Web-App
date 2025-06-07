// File for handling Employee related routes

const express = require("express");
const router = express.Router();

router.get("/dashboard/:fname/:ssn", (req, res) => {
  const { fname, ssn } = req.params;

  // Load employee dashboard
  res.render("employee-dashboard", { fname, ssn });
});




module.exports = router;
