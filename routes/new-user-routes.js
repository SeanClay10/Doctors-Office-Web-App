const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Show registration form
router.get("/register", (req, res) => {
  res.render("register-patient", { error: null });
});

// Handle registration form submission
router.post("/register", async (req, res) => {
  const { fname, lname, phone_number, street, city, state, zip_code, email } = req.body;
  try {
    // Insert into Patient table
    await db.promise().query(
      `INSERT INTO Patient (fname, lname, phone_number, email, street, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fname, lname, phone_number, email, street, city, state, zip_code]
    );
    res.redirect("/new-user/register-success");
  } catch (err) {
    console.error(err);
    res.render("register-patient", { error: "Registration failed. Please try again." });
  }
});

// Show registration success page
router.get("/register-success", (req, res) => {
  res.render("register-success");
});

module.exports = router;