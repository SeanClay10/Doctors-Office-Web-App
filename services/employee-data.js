// File for handling Employee db queries

const db = require("../db/connection");

async function getAllEmployeeData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT employee_id, fname, lname, phone_number, email
         FROM Employee`,
      [],
      (err, results) => {
        if (err) reject(err);
        else {
            resolve(results);
        }
      }
    );
  });
}

module.exports = {
  getAllEmployeeData: getAllEmployeeData,
};
