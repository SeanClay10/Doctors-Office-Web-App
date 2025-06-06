const db = require('../db/connection');

// Reusable function to get offices and doctors
async function getOfficeAndDoctorData() {
  const [offices, doctors] = await Promise.all([
    new Promise((resolve, reject) => {
      db.query(
        `SELECT office_name, 
                CONCAT(street, ', ', city, ', ', state, ' ', zip) AS location, 
                phone_number 
         FROM Office`, 
        (err, results) => err ? reject(err) : resolve(results)
      );
    }),
    new Promise((resolve, reject) => {
      db.query(
        `SELECT fname, lname, specialization 
         FROM Doctor 
         JOIN Employee ON Doctor.employee_id = Employee.employee_id`, 
        (err, results) => err ? reject(err) : resolve(results)
      );
    })
  ]);
  return { offices, doctors };
}

module.exports = getOfficeAndDoctorData;
