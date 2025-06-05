const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome new user! Feel free to browse our doctors and offices.');
});

module.exports = router;
