// Authors: Sean Clayton, Ivan Wong, Alex Loomis
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

async function addNewEmployee({ fname, lname, phone_number, email }) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO Employee (fname, lname, phone_number, email) VALUES (?, ?, ?, ?)`,
      [fname, lname, phone_number, email],
      (err, results) => {
        if (err) reject(err);
        else {
          resolve(results);
        }
      }
    );
  });
}

async function deleteEmployee(employeeId) {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM Employee WHERE employee_id = ?`,
      [employeeId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
}

module.exports = {
  getAllEmployeeData,
  addNewEmployee,
  deleteEmployee,
};
