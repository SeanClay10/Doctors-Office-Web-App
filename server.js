
// Module Imports & Config
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const db = require('./db/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View Engine Setup
app.set('view engine', 'ejs');

// Route Definitions
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

app.get('/login/employee', (req, res) => {
  res.render('employee-login', { error: null });
});

app.get('/login/patient', (req, res) => {
  res.render('patient-login', { error: null });
});

app.use('/new-user', require('./routes/new-user'));

// Server Startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
