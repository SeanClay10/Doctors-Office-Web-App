const db = require("../db/connection");

async function loginHandler(req, res) {
  try {
    const { role, ssn } = req.body;

    if (role === "employee") {
      const results = await new Promise((resolve, reject) => {
        db.query(
          "SELECT fname FROM Employee WHERE employee_id = ?",
          [ssn],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      if (results.length > 0) {
        const fname = results[0].fname;
        return res.render("employee-dashboard", { fname, ssn });
      } else {
        return res.render("employee-login", { error: "Invalid Employee ID" });
      }
    } else if (role === "patient") {
      const results = await new Promise((resolve, reject) => {
        db.query(
          "SELECT fname FROM Patient WHERE patient_id = ?",
          [ssn],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });
      if (results.length > 0) {
        const fname = results[0].fname;
        return res.render('patient-dashboard', {fname, ssn} );
      }

      else {
        return res.render("patient-login", { error: "Invalid Patient ID" });
      }
    }
  } catch (err) {
    console.log(err);
    res.render('main-page', { error: 'Unexpected server error' } );
  }
}

module.exports = loginHandler;
