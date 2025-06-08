// File for handling Patient db queries

const db = require("../db/connection");

async function getAllPatientData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT patient_id, fname as first_name, lname as last_name, phone_number, email, street, city, state, zip_code
        FROM Patient`,
      [],
      (err, results) => {
        if (err) reject(err);
        else {
          const formattedResults = results.map((p) => ({
            patient_id: p.patient_id,
            first_name: p.first_name,
            last_name: p.last_name,
            phone_number: p.phone_number,
            email: p.email,
            address: `${p.street} ${p.city}, ${p.state} ${p.zip_code}`
          }));
          resolve(formattedResults);
        }
      }
    );
  });
}

module.exports = {
    getAllPatientData: getAllPatientData,
};
