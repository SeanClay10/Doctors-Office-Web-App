// File for handling Patient routes

const express = require("express");
const router = express.Router();

// Import db queries
const getOfficeData = require("../services/office-data");
const getDoctorData = require("../services/doctor-data");
const { getApptsForPatient } = require("../services/appointment-data");
const { getBillsForPatient } = require("../services/bill-data");

router.get("/dashboard/:fname/:ssn", async (req, res) => {
  // Get required data to load page
  const { fname, ssn } = req.params;
  const offices = await getOfficeData();
  const doctors = await getDoctorData();
  const { pastAppointments, upcomingAppointments } = await getApptsForPatient(ssn);
  const bills = await getBillsForPatient(ssn);

  // Load patient page
  res.render("patient-dashboard", {
    fname,
    offices,
    doctors,
    appointmentsPast: pastAppointments,
    appointmentsUpcoming: upcomingAppointments,
    bills,
  });
});

module.exports = router;
