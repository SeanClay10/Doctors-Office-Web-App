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

const {
  getAllPatientData,
  addNewPatient,
} = require("../services/patient-data");

const {
  getAllEmployeeData,
  addNewEmployee,
} = require("../services/employee-data");

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
    const total_amount = 0; // getTotalBillingBalance(id)

    res.render("patient/patient-bills", {
      total_amount,
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

router.get("/register-patient-form", (_, res) => {
  res.render("employee/add-patient", { error: null });
});

router.post("/add-patient", async (req, res) => {
  try {
    const { fname, lname, phone_number, street, city, state, zip_code, email } =
      req.body;
    const patient = {
      fname,
      lname,
      phone_number,
      street,
      city,
      state,
      zip_code,
      email,
    };
    // Insert into Patient table
    await addNewPatient(patient);
    res.redirect('/common/success-page');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/register-employee-form/", (_, res) => {
  res.render(`employee/add-employee`, { error: null });
});

router.post("/add-employee", async (req, res) => {
  try {
    const { fname, lname, phone_number, email } = req.body;
    const employee = { fname, lname, phone_number, email };

    // Add employee to db
    await addNewEmployee(employee);
    res.redirect('/common/success-page');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
