// File for handling login logic

// Module Imports & Config
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Login Route Handler
router.post('/', (req, res) => {
  const { role, ssn } = req.body;

 // Employee login
  if (role === 'employee') {
    db.query('SELECT fname FROM Employee WHERE employee_id = ?', [ssn], (err, results) => {
      if (err) return res.render('main-page', { error: 'Server error' });
      if (results.length > 0) {
        const fname = results[0].fname;
        // Redirect to employee view with fname
        res.render('employee-dashboard', { fname });
      } else {
        res.render('employee-login', { error: 'Invalid Employee ID' });
      }
    });

  // Patient login
  } else if (role === 'patient') {
    db.query('SELECT fname FROM Patient WHERE patient_id = ?', [ssn], (err, results) => {
      if (err) return res.render('main-page', { error: 'Server error' });
      if (results.length > 0) {
        const fname = results[0].fname;
        // Redirect to patient view with fname
        res.render('patient-dashboard', { fname });
      } else {
        res.render('patient-login', { error: 'Invalid Patient ID' });
      }
    });

  // Redirect to new user registration view if role is not recognized
  } else {
    res.redirect('/new-user-dashboard');
  }
});

module.exports = router;
