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

async function getAllBills() {}

module.exports = {
  getBillsForPatient: getBillsForPatient,
  getAllBills: getAllBills,
};
