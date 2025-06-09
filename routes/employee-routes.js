// File for handling Employee related routes

const express = require("express");
const router = express.Router();
const db = require("../db/connection");

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
  getPatientById,
} = require("../services/patient-data");
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
    employee_id: ssn, // <-- Add this line
    offices,
    employees,
    doctors,
    patients,
  });
});

router.get("/view-patient-bill/:id", async (req, res) => {
  try {
    const { id } = req.params; // patient id
    const employee_id = req.query.employee_ssn; // still used for billing
    const employee_fname = req.query.employee_fname; // <-- add this
    const employee_ssn = req.query.employee_ssn;     // <-- add this

    const bills = await getBillsForPatient(id);
    const total_amount = 0; // getTotalBillingBalance(id)

    // Get appointments for the patient (employee view)
    const { upcomingAppointments, pastAppointments } = await getAppointmentsForPatient(id);
    const allAppointments = [...upcomingAppointments, ...pastAppointments];

    res.render("patient/patient-bills", {
      total_amount,
      bills,
      patient_id: id,
      employee_id,      // for billing
      employee_fname,   // <-- pass to EJS
      employee_ssn,     // <-- pass to EJS
      appointments: allAppointments,
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
    const { id } = req.params; // patient id
    // Get employee info from session, query, or authentication
    const employee_fname = req.query.employee_fname; // or req.session.employee_fname, etc.
    const employee_ssn = req.query.employee_ssn;     // or req.session.employee_ssn, etc.

    const { pastAppointments, upcomingAppointments } = await getAppointmentsForPatient(id);
    const patient = await getPatientById(id);

    res.render("patient/patient-appointments", {
      appointmentsPast: pastAppointments,
      appointmentsUpcoming: upcomingAppointments,
      ssn: id,
      fname: patient ? patient.fname : "",
      employee_fname,
      employee_ssn
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/register-patient-form", (req, res) => {
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
    // res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Show add appointment form for a patient (employee view)
router.get("/add-appointment/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const doctors = await getDoctorData();
  const patient = await getPatientById(patientId);
  res.render("patient/add-appointment", {
    fname: patient ? patient.fname : "",
    ssn: patientId,
    doctors,
    error: null,
    isEmployee: true
  });
});

// Handle add appointment form submission (employee view)
router.post("/add-appointment/:patientId", async (req, res) => {
  const { patientId } = req.params;
  let { doctor_id, date, start_time, end_time, note } = req.body;
  start_time = start_time.replace(":", "");
  try {
    await addAppointment(patientId, doctor_id, date, start_time, end_time, note);
    res.redirect(`/employee/view-patient-appointments/${patientId}`); // <-- patient appointments
  } catch (err) {
    console.error(err);
    const doctors = await getDoctorData();
    const patient = await getPatientById(patientId);
    res.render("patient/add-appointment", {
      fname: patient ? patient.fname : "",
      ssn: patientId,
      doctors,
      error: "Failed to add appointment.",
    });
  }
});

// Show update form for a patient's appointment (employee view)
router.get("/update-appointment/:apptId/:patientId", async (req, res) => {
  const { apptId, patientId } = req.params;
  const { employee_fname, employee_ssn } = req.query; // <-- get from query
  const doctors = await getDoctorData();
  const { pastAppointments, upcomingAppointments } = await getAppointmentsForPatient(patientId);
  const appointment = [...pastAppointments, ...upcomingAppointments].find(a => a.appointment_id == apptId);
  const patient = await getPatientById(patientId);

  res.render("patient/update-appointment", {
    fname: patient ? patient.fname : "",
    ssn: patientId,
    doctors,
    appointment,
    error: null,
    redirectTo: `/employee/view-patient-appointments/${patientId}?employee_fname=${employee_fname}&employee_ssn=${employee_ssn}`
  });
});

// Handle update form submission (employee view)
router.post("/update-appointment/:apptId/:fname/:ssn", async (req, res) => {
  const { apptId, fname, ssn } = req.params;
  let { doctor_id, start_time, end_time, note, redirectTo } = req.body;
  if (start_time) start_time = start_time.replace(":", "");
  if (end_time) end_time = end_time.replace(":", "");
  try {
    await updateAppointment(apptId, ssn, doctor_id, start_time, end_time, note);
    res.redirect(redirectTo || `/patient/dashboard/${fname}/${ssn}`);
  } catch (err) {
    console.error(err);
    const doctors = await getDoctorData();
    const { pastAppointments, upcomingAppointments } = await getAppointmentsForPatient(ssn);
    const appointment = [...pastAppointments, ...upcomingAppointments].find(a => a.appointment_id == apptId);
    const patient = await getPatientById(ssn);
    res.render("patient/update-appointment", {
      fname: patient ? patient.fname : "",
      ssn,
      doctors,
      appointment,
      error: "Failed to update appointment."
    });
  }
});

// Delete appointment (employee view)
router.delete("/appointment/:apptId/:patientId", async (req, res) => {
  const { apptId, patientId } = req.params;
  try {
    await deleteAppointment(apptId, patientId, "employee");
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/add-bill", async (req, res) => {
  try {
    const { employee_id, employee_fname, employee_ssn, patient_id, appointment_id, amount_due, billing_date, due_date } = req.body;
    // Insert into BillingStatement table
    await db.promise().query(
      `INSERT INTO BillingStatement (employee_id, patient_id, appointment_id, amount_due, billing_date, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, patient_id, appointment_id, amount_due, billing_date, due_date]
    );
    res.redirect(`/employee/view-patient-bill/${patient_id}?employee_fname=${encodeURIComponent(employee_fname)}&employee_ssn=${encodeURIComponent(employee_ssn)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add billing statement.");
  }
});

module.exports = router;
