
const db = require("../db/connection");

async function getDoctorData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT Doctor.employee_id, fname, lname, specialization 
       FROM Doctor 
       JOIN Employee ON Doctor.employee_id = Employee.employee_id`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

async function getDoctorWorkplaces(id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT o.office_name, o.street, o.city, o.state, o.zip, o.phone_number
       FROM Office o
       INNER JOIN DoctorWorkplace dw ON dw.office_name = o.office_name
       INNER JOIN Doctor d ON d.employee_id = dw.employee_id
       WHERE d.employee_id = ?`,
       [id],
       (err, results) => {
        if (err) reject(err);
        else {
          const formattedResults = results.map((o) => ({
            office_name: o.office_name,
            location: `${o.street} ${o.city}, ${o.state} ${o.zip}`,
            phone_number: o.phone_number
          }));
          resolve(formattedResults);
        }
       }
    );
  });
}

module.exports = {
  getDoctorData: getDoctorData,
  getDoctorWorkplaces: getDoctorWorkplaces,
};
