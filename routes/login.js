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
      if (err) return res.render('index', { error: 'Server error' });
      if (results.length > 0) {
        const fname = results[0].fname;
        res.send(`Welcome ${fname}!`);
      } else {
        res.render('employee-login', { error: 'Invalid Employee ID' });
      }
    });
  // Patient login
  } else if (role === 'patient') {
    db.query('SELECT fname FROM Patient WHERE patient_id = ?', [ssn], (err, results) => {
      if (err) return res.render('index', { error: 'Server error' });
      if (results.length > 0) {
        const fname = results[0].fname;
        res.send(`Welcome ${fname}!`);
      } else {
        res.render('patient-login', { error: 'Invalid Patient ID' });
      }
    });
  // Redirect to new user registration if not patient or employee
  } else {
    res.redirect('/new-user');
  }
});

module.exports = router;
