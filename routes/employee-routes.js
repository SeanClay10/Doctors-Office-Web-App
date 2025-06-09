// File for handling Employee related routes

const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Import db queries
const getOfficeData = require("../services/office-data");
const { getDoctorData, addDoctor } = require("../services/doctor-data");

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
  deletePatient,
} = require("../services/patient-data");

const {
  getAllEmployeeData,
  addNewEmployee,
  deleteEmployee,
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
    employee_id: ssn, // <-- Add this line
    offices,
    employees,
    doctors,
    patients,
  });
});

router.get("/view-patient-bill/:id", async (req, res) => {
  try {
    const { id } = req.params; // patient_id
    const employee_fname = req.query.employee_fname;
    const employee_ssn = req.query.employee_ssn;

    // Fetch only this patient's bills
    const bills = await getBillsForPatient(id);

    // Calculate total balance for this patient
    const total_amount = bills.reduce((sum, bill) => sum + Number(bill.amount_due), 0);

    // Fetch patient info for name
    const patient = await getPatientById(id); // Implement this if not already

    // Fetch appointments for this patient
    const { upcomingAppointments, pastAppointments } = await getAppointmentsForPatient(id);
    const appointments = [...upcomingAppointments, ...pastAppointments];

    res.render("patient/patient-bills", {
      total_amount,
      bills,
      patient_id: id,
      employee_fname,
      employee_ssn,
      employee_id: employee_ssn, // if you use ssn as employee_id
      appointments,
      patient_name: patient ? `${patient.fname} ${patient.lname}` : "Unknown Patient"
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
    const employee_fname = req.query.employee_fname;
    const employee_ssn = req.query.employee_ssn;

    const { pastAppointments, upcomingAppointments } = await getAppointmentsForPatient(id);
    const patient = await getPatientById(id);

    res.render("patient/patient-appointments", {
      appointmentsPast: pastAppointments,
      appointmentsUpcoming: upcomingAppointments,
      ssn: id,
      fname: patient ? patient.fname : "",
      employee_fname,
      employee_ssn,
      patient
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

// Show add doctor form
router.get("/add-doctor-form", async (req, res) => {
  const employees = await getAllEmployeeData();
  const doctors = await getDoctorData(); // <-- get all doctors for filtering
  const { employee_fname, employee_ssn } = req.query;
  res.render("employee/add-doctor", {
    employees,
    doctors, // <-- pass doctors to template
    employee_fname,
    employee_ssn,
    error: null
  });
});

// Add doctor (from existing employee)
router.post("/add-doctor", async (req, res) => {
  try {
    const { employee_id, specialization, employee_fname, employee_ssn } = req.body;
    await addDoctor(employee_id, specialization);
    // Redirect back to dashboard with preserved params
    res.redirect(`/employee/dashboard/${encodeURIComponent(employee_fname)}/${encodeURIComponent(employee_ssn)}`);
  } catch (err) {
    // On error, re-render form with error message and preserved params
    const employees = await getAllEmployeeData();
    res.render("employee/add-doctor", {
      employees,
      employee_fname: req.body.employee_fname,
      employee_ssn: req.body.employee_ssn,
      error: "Failed to add doctor."
    });
  }
});

// Delete doctor (remove from Doctor table)
router.delete("/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  try {
    await require("../services/doctor-data").deleteDoctor(doctorId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Show add appointment form for a patient (employee view)
router.get("/add-appointment/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const employee_fname = req.query.employee_fname;
  const employee_ssn = req.query.employee_ssn;
  const doctors = await getDoctorData();
  const patient = await getPatientById(patientId);
  res.render("patient/add-appointment", {
    fname: patient ? patient.fname : "",
    ssn: patientId,
    doctors,
    error: null,
    isEmployee: true,
    employee_fname, // <-- pass this
    employee_ssn 

  });
});

// Handle add appointment form submission (employee view)
router.post("/add-appointment/:patientId", async (req, res) => {
  const { patientId } = req.params;
  let { doctor_id, date, start_time, end_time, note, employee_fname, employee_ssn } = req.body;
  start_time = start_time.replace(":", "");
  try {
    await addAppointment(patientId, doctor_id, date, start_time, end_time, note);
    // Redirect with employee_fname and employee_ssn in the query string
    res.redirect(`/employee/view-patient-appointments/${patientId}?employee_fname=${encodeURIComponent(employee_fname)}&employee_ssn=${encodeURIComponent(employee_ssn)}`);
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
    isEmployee: true,
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
    let { employee_id, employee_fname, employee_ssn, patient_id, appointment_id, amount_due, billing_date, due_date } = req.body;

    // If employee_id is missing or undefined, look it up using employee_ssn
    if (!employee_id && employee_ssn) {
      const [rows] = await db.promise().query(
        "SELECT employee_id FROM Employee WHERE ssn = ? OR employee_id = ? LIMIT 1",
        [employee_ssn, employee_ssn]
      );
      if (rows.length > 0) {
        employee_id = rows[0].employee_id;
      }
    }

    // If still not found, throw error
    if (!employee_id) {
      throw new Error("Could not determine employee_id for billing statement.");
    }

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

// Delete patient (employee view)
router.delete("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;
  try {
    await deletePatient(patientId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete employee (employee view)
router.delete("/employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    await deleteEmployee(employeeId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
