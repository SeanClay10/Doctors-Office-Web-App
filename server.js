
// Module Imports & Config
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const getOfficeData = require('./services/office-data');
const getDoctorData = require('./services/doctor-data');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View Engine Setup
app.set('view engine', 'ejs');

// Route Definitions
app.get('/', (req, res) => {
  res.render('main-page', { error: null });
});

// Backend API routes
const loginRoutes = require('./routes/login');
const patientRoutes = require('./routes/patient-access');

app.use('/login', loginRoutes);
app.use('/patient', patientRoutes);

// // Frontend pages
app.get('/login/employee', (req, res) => {
  res.render('employee-login', { error: null });
});

app.get('/login/patient', (req, res) => {
  res.render('patient-login', { error: null });
});

app.get("/employee-dashboard/:fname/:ssn", (req, res) => {
  const { fname, ssn } = req.params;

  res.render("employee-dashboard", { fname, ssn });
});

app.get("/patient-dashboard/:fname/:ssn", async (req, res) => {
  const { fname, ssn } = req.params;
  const offices = await getOfficeData();
  const doctors = await getDoctorData();

  res.render("patient-dashboard", { fname, ssn });
});

app.get('/new-user-dashboard', async (req, res) => {
  const offices = await getOfficeData();
  const doctors = await getDoctorData();

  res.render("new-user-dashboard", { offices, doctors });
});


// Server Startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
