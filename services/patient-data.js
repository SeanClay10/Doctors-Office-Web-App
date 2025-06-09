// File for handling Patient db queries

const db = require("../db/connection");

async function getAllPatientData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT patient_id, fname, lname, phone_number, email, street, city, state, zip_code
        FROM Patient`,
      [],
      (err, results) => {
        if (err) reject(err);
        else {
          const formattedResults = results.map((p) => ({
            patient_id: p.patient_id,
            fname: p.fname,
            lname: p.lname,
            phone_number: p.phone_number,
            email: p.email,
            address: `${p.street} ${p.city}, ${p.state} ${p.zip_code}`,
          }));
          resolve(formattedResults);
        }
      }
    );
  });
}

async function addNewPatient({
  fname,
  lname,
  phone_number,
  street,
  city,
  state,
  zip_code,
  email,
}) {
  // Insert into Patient table
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO Patient (fname, lname, phone_number, email, street, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fname, lname, phone_number, email, street, city, state, zip_code],
      (err, results) => {
        if (err) reject(err);
        else {
          resolve(results);
        }
      }
    );
  });
}

async function getPatientById(patientId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT patient_id, fname, lname, phone_number, email, street, city, state, zip_code
        FROM Patient
        WHERE patient_id = ?`,
      [patientId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      }
    );
  });
}

module.exports = {
  getAllPatientData: getAllPatientData,
  addNewPatient: addNewPatient,
  getPatientById: getPatientById,
};
