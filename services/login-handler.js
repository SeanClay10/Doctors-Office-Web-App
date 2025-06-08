const db = require("../db/connection");

async function loginHandler(req, res) {
  try {
    const { role, ssn } = req.body;

    // Employee selected
    if (role === "employee") {
      const results = await new Promise((resolve, reject) => {
        // Get first name for welcome text
        db.query(
          "SELECT fname FROM Employee WHERE employee_id = ?",
          [ssn],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      // Return dashboard or error
      if (results.length > 0) {
        const fname = results[0].fname;
        return res.redirect(`/employee/dashboard/${fname}/${ssn}`);
      } else {
        return res.render("employee/employee-login", { error: "Invalid Employee ID" });
      }

      // Patient selected
    } else if (role === "patient") {
      const results = await new Promise((resolve, reject) => {
        // Get first name
        db.query(
          "SELECT fname FROM Patient WHERE patient_id = ?",
          [ssn],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      // Return dashboard or error
      if (results.length > 0) {
        const fname = results[0].fname;

        return res.redirect(`/patient/dashboard/${fname}/${ssn}`);
      } else {
        return res.render("patient/patient-login", { error: "Invalid Patient ID" });
      }
    }
    // New user selected
    else {
      res.redirect("new-user/new-user-dashboard");
    }
  } catch (err) {
    console.log(err);
    res.render("main-page", { error: "Unexpected server error" });
  }
}

module.exports = loginHandler;
