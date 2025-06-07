// File for getting appointment data from db

const db = require("../db/connection");

async function getAppointmentsForPatient(ssn) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT A.date, A.start_time, A.end_time, A.note, E.fname AS doctor_fname, E.lname AS doctor_lname 
             FROM Appointment A
             JOIN Doctor D ON A.employee_id = D.employee_id
             JOIN Employee E ON D.employee_id = E.employee_id
             WHERE A.patient_id = ?`,
      [ssn],
      (err, results) => {
        if (err) return reject(err);

        const today = new Date();
        const pastAppointments = [];
        const upcomingAppointments = [];

        results.forEach((r) => {
          const rawDate = new Date(r.date);
          const formattedDate = `${String(rawDate.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(rawDate.getDate()).padStart(
            2,
            "0"
          )}/${rawDate.getFullYear()}`;

          const appointment = {
            date: formattedDate,
            start_time: r.start_time,
            end_time: r.end_time,
            note: r.note,
            doctor_name: `${r.doctor_fname} ${r.doctor_lname}`,
          };

          if (rawDate < today) {
            pastAppointments.push(appointment);
          } else {
            upcomingAppointments.push(appointment);
          }
        });
        resolve({ pastAppointments, upcomingAppointments });
      }
    );
  });
}

async function getAllAppointments() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT A.date, A.start_time, A.end_time, A.note, E.fname AS doctor_fname, E.lname AS doctor_lname 
            FROM Appointment A
            JOIN Doctor D ON A.employee_id = D.employee_id
            JOIN Employee E ON D.employee_id = E.employee_id`,
      [],
      (err, results) => {
        if (err) reject(err);

        resolve(results);
      }
    );
  });
}

async function addAppointment() {}

async function updateAppointment() {}

async function deleteAppointment(apptId, id, role) {}

module.exports = {
  getAppointmentsForPatient: getAppointmentsForPatient,
  getAllAppointments: getAllAppointments,
};
