// File for handling Employee related routes

const express = require("express");
const router = express.Router();

// Import db queries
const getOfficeData = require("../services/office-data");
const getDoctorData = require("../services/doctor-data");
const { getAppointmentsForPatient } = require("../services/appointment-data");
const { getBillsForPatient } = require("../services/bill-data");
const { deleteAppointment } = require("../services/appointment-data");
const { addAppointment } = require("../services/appointment-data");
const { updateAppointment } = require("../services/appointment-data");

router.get("/dashboard/:fname/:ssn", async (req, res) => {
  const { fname, ssn } = req.params;

  const offices = await getOfficeData();
  const doctors = await getDoctorData();

  res.render("employee-dashboard", {
    fname,
    ssn,
    offices,
    doctors,
  });
});

module.exports = router;
