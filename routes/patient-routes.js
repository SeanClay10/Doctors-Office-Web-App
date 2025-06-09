// File for handling Patient routes

const express = require("express");
const router = express.Router();

// Import db queries
const getOfficeData = require("../services/office-data");
const { getDoctorData } = require("../services/doctor-data");
const { getAppointmentsForPatient } = require("../services/appointment-data");
const { getBillsForPatient } = require("../services/bill-data");
const { deleteAppointment } = require("../services/appointment-data");
const { addAppointment } = require("../services/appointment-data");
const { updateAppointment } = require("../services/appointment-data");

router.get("/dashboard/:fname/:ssn", async (req, res) => {
  // Get required data to load page
  const { fname, ssn } = req.params;
  const offices = await getOfficeData();
  const doctors = await getDoctorData();
  const { pastAppointments, upcomingAppointments } =
    await getAppointmentsForPatient(ssn);
  const bills = await getBillsForPatient(ssn);

  // Load patient page
  res.render("patient/patient-dashboard", {
    fname,
    ssn,
    offices,
    doctors,
    appointmentsPast: pastAppointments,
    appointmentsUpcoming: upcomingAppointments,
    bills,
  });
});

// Delete appointment
router.delete("/appointment/:apptId/:ssn", async (req, res) => {
  const { apptId, ssn } = req.params;
  try {
    await deleteAppointment(apptId, ssn, "patient");
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Show add appointment form
router.get("/add-appointment/:fname/:ssn", async (req, res) => {
  const { fname, ssn } = req.params;
  const doctors = await getDoctorData();
  res.render("patient/add-appointment", { fname, ssn, doctors, error: null });
});

// Handle form submission
router.post("/add-appointment/:fname/:ssn", async (req, res) => {
  const { fname, ssn } = req.params;
  let { doctor_id, date, start_time, end_time, note } = req.body;
  // Convert time to integer
  start_time = start_time.replace(":", "");
  try {
    await addAppointment(ssn, doctor_id, date, start_time, end_time, note);
    res.redirect(`/patient/dashboard/${fname}/${ssn}`);
  } catch (err) {
    console.error(err);
    const doctors = await getDoctorData();
    res.render("patient/add-appointment", {
      fname,
      ssn,
      doctors,
      error: "Failed to add appointment.",
    });
  }
});

// Show update form
router.get("/update-appointment/:apptId/:fname/:ssn", async (req, res) => {
  const { apptId, fname, ssn } = req.params;
  const doctors = await getDoctorData();
  const { pastAppointments, upcomingAppointments } =
    await getAppointmentsForPatient(ssn);

  // Find the appointment to update
  const appointment = [...pastAppointments, ...upcomingAppointments].find(
    (a) => a.appointment_id == apptId
  );
  res.render("patient/update-appointment", {
    fname,
    ssn,
    doctors,
    appointment,
    error: null,
  });
});

// Handle update form submission
router.post("/update-appointment/:apptId/:fname/:ssn", async (req, res) => {
  const { apptId, fname, ssn } = req.params;
  let { doctor_id, start_time, end_time, note } = req.body;
  // Convert time if needed
  if (start_time) start_time = start_time.replace(":", "");
  if (end_time) end_time = end_time.replace(":", "");
  try {
    await updateAppointment(apptId, ssn, doctor_id, start_time, end_time, note);
    res.redirect(`/patient/dashboard/${fname}/${ssn}`);
  } catch (err) {
    console.error(err);
    const doctors = await getDoctorData();
    const { pastAppointments, upcomingAppointments } =
      await getAppointmentsForPatient(ssn);
    const appointment = [...pastAppointments, ...upcomingAppointments].find(
      (a) => a.appointment_id == apptId
    );
    res.render("patient/update-appointment", {
      fname,
      ssn,
      doctors,
      appointment,
      error: "Failed to update appointment.",
    });
  }
});

module.exports = router;
