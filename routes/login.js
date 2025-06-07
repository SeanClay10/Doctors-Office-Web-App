const express = require('express');
const router = express.Router();
const loginHandler = require('../services/login-handler');

router.post('/', loginHandler);

module.exports = router;
