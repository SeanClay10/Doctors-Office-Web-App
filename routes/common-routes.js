// File for handling shared routes between different pages

const express = require('express');
const router = express.Router();

const { getDoctorWorkplaces } = require('../services/doctor-data');

router.get("/view-doctor-workplace/:ssn", async (req, res) => {
  const { ssn } = req.params;
  try {
    const offices = await getDoctorWorkplaces(ssn);
    
    res.render('commons/doctor-workplaces', {
      offices,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
