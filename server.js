// Module Imports & Config
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// DB queries to grab initial data
const getOfficeData = require("./services/office-data");
const getDoctorData = require("./services/doctor-data");
const { getApptsForPatient } = require("./services/appointment-data");
const { getBillsForPatient } = require("./services/bill-data");

// View Engine Setup
app.set("view engine", "ejs");

// Route Definitions
app.get("/", (req, res) => {
  res.render("main-page", { error: null });
});

// Backend API routes
const loginRoutes = require("./routes/login");
const patientRoutes = require("./routes/patient-routes");

app.use("/login", loginRoutes);
app.use("/patient", patientRoutes);

// Frontend pages
app.get("/login/employee", (req, res) => {
  // Load login form
  res.render("employee-login", { error: null });
});

app.get("/login/patient", (req, res) => {
  // Load login form
  res.render("patient-login", { error: null });
});

app.get("/employee-dashboard/:fname/:ssn", async (req, res) => {
  const { fname, ssn } = req.params;

  // Load employee dashboard
  res.render("employee-dashboard", { fname, ssn });
});

app.get("/patient-dashboard/:fname/:ssn", async (req, res) => {
  // Get required data to load page
  const { fname, ssn } = req.params;
  const offices = await getOfficeData();
  const doctors = await getDoctorData();
  const { pastAppointments, upcomingAppointments } = await getApptsForPatient(
    ssn
  );
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

app.get("/new-user-dashboard", async (req, res) => {
  // Get required data for a new user
  const offices = await getOfficeData();
  const doctors = await getDoctorData();

  // Load new user page
  res.render("new-user-dashboard", { offices, doctors });
});

// Server Startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
