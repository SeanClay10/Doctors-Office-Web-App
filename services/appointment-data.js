// File for getting appointment data from db
// Authors: Sean Clayton, Ivan Wong, Alex Loomis
const db = require("../db/connection");

async function getAppointmentsForPatient(ssn) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT A.appointment_id, A.date, A.start_time, A.end_time, A.note, E.fname AS doctor_fname, E.lname AS doctor_lname 
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
            appointment_id: r.appointment_id,
            date: formattedDate,
            start_time: r.start_time,
            end_time: r.end_time,
            note: r.note,
            doctor_name: `${r.doctor_fname} ${r.doctor_lname}`,
            doctor_id: r.employee_id
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

async function getAppointmentsForDoctor(id) {
  return new Promise((resolve, reject) => {
    db.query(
      "CALL getAppointmentsForDoctor(?)",
      [id],
      (err, results) => {
        if (err) return reject(err);

        // results[0] contains the result set from the SELECT in the procedure
        const today = new Date();
        const pastAppointments = [];
        const upcomingAppointments = [];

        results[0].forEach((r) => {
          const rawDate = new Date(r.date);
          const formattedDate = `${String(rawDate.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(rawDate.getDate()).padStart(
            2,
            "0"
          )}/${rawDate.getFullYear()}`;

          const appointment = {
            appointment_id: r.appointment_id,
            date: formattedDate,
            start_time: r.start_time,
            end_time: r.end_time,
            note: r.note,
            patient_name: `${r.patient_fname} ${r.patient_lname}`,
            patient_id: r.patient_id,
            doctor_id: r.employee_id
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
      `SELECT A.appointment_id, A.date, A.start_time, A.end_time, A.note, E.fname AS doctor_fname, E.lname AS doctor_lname 
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

async function addAppointment(patient_id, doctor_id, date, start_time, end_time, note) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Appointment (patient_id, employee_id, date, start_time, end_time, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [patient_id, doctor_id, date, start_time, end_time, note],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

async function updateAppointment(apptId, patientId, doctorId, start_time, end_time, note) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE Appointment
      SET employee_id = ?, start_time = ?, end_time = ?, note = ?
      WHERE appointment_id = ? AND patient_id = ?
    `;
    db.query(
      sql,
      [doctorId, start_time, end_time, note, apptId, patientId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

async function deleteAppointment(apptId, id, role) {
  return new Promise((resolve, reject) => {
    // Only allow patient to delete their own appointment
    db.query(
      `DELETE FROM Appointment WHERE appointment_id = ? AND patient_id = ?`,
      [apptId, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

module.exports = {
  getAppointmentsForPatient: getAppointmentsForPatient,
  getAppointmentsForDoctor: getAppointmentsForDoctor,
  addAppointment: addAppointment,
  getAllAppointments: getAllAppointments,
  deleteAppointment: deleteAppointment,
  updateAppointment: updateAppointment
};
