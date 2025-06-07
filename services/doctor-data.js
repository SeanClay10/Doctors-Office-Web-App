
const db = require("../db/connection");

async function getDoctorData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT fname, lname, specialization 
       FROM Doctor 
       JOIN Employee ON Doctor.employee_id = Employee.employee_id`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

module.exports = getDoctorData;
