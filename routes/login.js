// Authors: Sean Clayton, Ivan Wong, Alex Loomis
const express = require('express');
const router = express.Router();

const loginHandler = require('../services/login-handler');

router.post('/', loginHandler);

router.get("/employee", (_, res) => {
  // Change to:
  res.render("employee/employee-login", { error: null });
});

router.get("/patient", (_, res) => {
  // Change to:
  res.render("patient/patient-login", { error: null });
});


module.exports = router;
