// File for handling Employee related routes

const express = require("express");
const router = express.Router();

// Import db queries
const getOfficeData = require("../services/office-data");
const { getDoctorData } = require("../services/doctor-data");
const {
  getAppointmentsForPatient,
  getAppointmentsForDoctor,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../services/appointment-data");
const { getAllPatientData } = require("../services/patient-data");
const { getAllEmployeeData } = require("../services/employee-data");
const { getBillsForPatient } = require("../services/bill-data");

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

router.get("/view-patient-bill/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bills = await getBillsForPatient(id);

    res.render("patient/patient-bills", {
      bills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/view-doctor-appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { pastAppointments, upcomingAppointments } =
      await getAppointmentsForDoctor(id);

    res.render(`employee/doctor-appointments`, {
      appointmentsPast: pastAppointments,
      appointmentsUpcoming: upcomingAppointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/view-patient-appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { pastAppointments, upcomingAppointments } =
      await getAppointmentsForPatient(id);

    res.render("patient/patient-appointments", {
      appointmentsPast: pastAppointments,
      appointmentsUpcoming: upcomingAppointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
