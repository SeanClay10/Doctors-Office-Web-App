const express = require('express');
const router = express.Router();
const loginHandler = require('../services/login-handler');

router.post('/', loginHandler);


// router.post('/', async (req, res) => {
//   try {
//     const { role, ssn } = req.body;

//     const { offices, doctors } = await getOfficeAndDoctorData();

//     // Employee login
//     if (role === 'employee') {
//       const results = await new Promise((resolve, reject) => {
//         db.query('SELECT fname FROM Employee WHERE employee_id = ?', [ssn], (err, results) => {
//           if (err) reject(err); else resolve(results);
//         });
//       });

//       if (results.length > 0) {
//         const fname = results[0].fname;
//         res.render('employee-dashboard', { fname, offices, doctors });
//       } else {
//         res.render('employee-login', { error: 'Invalid Employee ID' });
//       }

//     // Patient login
//     } else if (role === 'patient') {
//       const results = await new Promise((resolve, reject) => {
//         db.query('SELECT fname FROM Patient WHERE patient_id = ?', [ssn], (err, results) => {
//           if (err) reject(err); else resolve(results);
//         });
//       });

//       if (results.length === 0) {
//         return res.render('patient-login', { error: 'Invalid Patient ID' });
//       }

//       const fname = results[0].fname;

//       const [appointmentSets, bills] = await Promise.all([
//         new Promise((resolve, reject) => {
//           db.query(
//             `SELECT A.date, A.start_time, A.end_time, A.note, E.fname AS doctor_fname, E.lname AS doctor_lname 
//              FROM Appointment A
//              JOIN Doctor D ON A.employee_id = D.employee_id
//              JOIN Employee E ON D.employee_id = E.employee_id
//              WHERE A.patient_id = ?`, 
//             [ssn],
//             (err, results) => {
//               if (err) return reject(err);

//               const today = new Date();
//               const pastAppointments = [];
//               const upcomingAppointments = [];

//               results.forEach(r => {
//                 const rawDate = new Date(r.date);
//                 const formattedDate = `${String(rawDate.getMonth() + 1).padStart(2, '0')}/${String(rawDate.getDate()).padStart(2, '0')}/${rawDate.getFullYear()}`;

//                 const appointment = {
//                   date: formattedDate,
//                   start_time: r.start_time,
//                   end_time: r.end_time,
//                   note: r.note,
//                   doctor_name: `${r.doctor_fname} ${r.doctor_lname}`
//                 };

//                 if (rawDate < today) {
//                   pastAppointments.push(appointment);
//                 } else {
//                   upcomingAppointments.push(appointment);
//                 }
//               });

//               resolve({ pastAppointments, upcomingAppointments });
//             }
//           );
//         }),
//         new Promise((resolve, reject) => {
//           db.query(
//             `SELECT amount_due, billing_date, due_date 
//              FROM BillingStatement 
//              WHERE patient_id = ?`, 
//             [ssn], 
//             (err, results) => {
//               if (err) reject(err); else {
//                 const formatted = results.map(b => ({
//                   amount_due: b.amount_due,
//                   billing_date: new Date(b.billing_date).toLocaleDateString('en-US'),
//                   due_date: new Date(b.due_date).toLocaleDateString('en-US')
//                 }));
//                 resolve(formatted);
//               }
//             }
//           );
//         })
//       ]);

//       const { pastAppointments, upcomingAppointments } = appointmentSets;

//       res.render('patient-dashboard', {
//         fname,
//         offices,
//         doctors,
//         appointmentsPast: pastAppointments,
//         appointmentsUpcoming: upcomingAppointments,
//         bills
//       });

//     // New user fallback
//     } else {
//       res.render('new-user-dashboard', { offices, doctors });
//     }

//   } catch (err) {
//     console.error(err);
//     res.render('main-page', { error: 'Unexpected server error.' });
//   }
// });

module.exports = router;
