// Authors: Sean Clayton, Ivan Wong, Alex Loomis
// File for getting billing statements from db

const db = require("../db/connection");

async function getBillsForPatient(ssn) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT amount_due, billing_date, due_date 
             FROM BillingStatement 
             WHERE patient_id = ?`,
      [ssn],
      (err, results) => {
        if (err) reject(err);
        else {
          const formatted = results.map((b) => ({
            amount_due: b.amount_due,
            billing_date: new Date(b.billing_date).toLocaleDateString("en-US"),
            due_date: new Date(b.due_date).toLocaleDateString("en-US"),
          }));
          resolve(formatted);
        }
      }
    );
  });
}

async function getAllBills() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.patient_id, p.fname as first_name, p.lname as last_name, b.amount_due, b.due_date
       FROM BillingStatement b
       INNER JOIN Patient p ON p.patient_id = b.patient_id
      `,
      [],
      (err, results) => {
        if (err) reject(err);
        else {
          const formattedResults = results.map((b) => ({
            patient_id: b.patient_id,
            first_name: b.first_name,
            last_name: b.last_name,
            amount_due: b.amount_due,
            due_date: new Date(b.due_date).toLocaleDateString("en-US"),
          }));
          resolve(formattedResults);
        }
      }
    );
  });
}

async function getAllPatientBalance() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.patient_id, p.fname as first_name, p.lname as last_name, SUM(b.amount_due) as total_balance
       FROM BillingStatement b
       INNER JOIN Patient p ON p.patient_id = b.patient_id
       GROUP BY p.patient_id
      `,
      [],
      (err, results) => {
        if (err) reject(err);
        else {
          const formattedResults = results.map((b) => ({
            patient_id: b.patient_id,
            first_name: b.first_name,
            last_name: b.last_name,
            total_balance: b.total_balance,
          }));
          resolve(formattedResults);
        }
      }
    );
  });
}

module.exports = {
  getBillsForPatient: getBillsForPatient,
  getAllBills: getAllBills,
  getAllPatientBalance: getAllPatientBalance,
};
