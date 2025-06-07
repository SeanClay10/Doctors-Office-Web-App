const express = require('express');
const router = express.Router();
const loginHandler = require('../services/login-handler');

router.post('/', loginHandler);

router.get("/employee", (_, res) => {
  // Load login form
  res.render("employee-login", { error: null });
});

router.get("/patient", (_, res) => {
  // Load login form
  res.render("patient-login", { error: null });
});


module.exports = router;
