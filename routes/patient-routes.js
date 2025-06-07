// File for handling Patient routes

const express = require("express");
const router = express.Router();

// Import db queries
const getOfficeData = require("../services/office-data");
const getDoctorData = require("../services/doctor-data");
const { getAppointmentsForPatient } = require("../services/appointment-data");
const { getBillsForPatient } = require("../services/bill-data");

router.get("/dashboard/:fname/:ssn", async (req, res) => {
  // Get required data to load page
  const { fname, ssn } = req.params;
  const offices = await getOfficeData();
  const doctors = await getDoctorData();
  const { pastAppointments, upcomingAppointments } = await getAppointmentsForPatient(ssn);
  const bills = await getBillsForPatient(ssn);

  // Load patient page
  res.render("patient-dashboard", {
    fname,
    ssn,
    offices,
    doctors,
    appointmentsPast: pastAppointments,
    appointmentsUpcoming: upcomingAppointments,
    bills,
  });
});

router.get('/delete-appointment/:ssn', (req, res) => {
    const ssn = req.params;



    res.status(200).json(testObj);
});

module.exports = router;
