// File for handling Employee related routes

const express = require("express");
const router = express.Router();

// Import db queries
const getOfficeData = require("../services/office-data");
const getDoctorData = require("../services/doctor-data");
const {
  getAppointmentsForPatient,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../services/appointment-data");
// const { getBillsForPatient } = require("../services/bill-data");
const { getAllPatientData } = require("../services/patient-data");
const { getAllEmployeeData } = require('../services/employee-data');

router.get("/dashboard/:fname/:ssn", async (req, res) => {
  const { fname, ssn } = req.params;

  const offices = await getOfficeData();
  const doctors = await getDoctorData();
  const patients = await getAllPatientData();
  const employees = await getAllEmployeeData();

  res.render("employee/employee-dashboard", {
    fname,
    ssn,
    offices,
    employees,
    doctors,
    patients,
  });
});

module.exports = router;
