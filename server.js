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

// View Engine Setup
app.set("view engine", "ejs");

// Main page route
app.get("/", (req, res) => {
  res.render("main-page", { error: null });
});

// Backend API routes
const loginRoutes = require("./routes/login");
const patientRoutes = require("./routes/patient-routes");
const employeeRoutes = require('./routes/employee-routes');
const newUserRoutes = require('./routes/new-user-routes');

app.use("/login", loginRoutes);
app.use("/patient", patientRoutes);
app.use("/employee", employeeRoutes);
app.use('/new-user', newUserRoutes);

// New user route -- No need to make a new route file, little logic required
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
