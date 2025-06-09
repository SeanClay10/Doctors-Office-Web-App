// Authors: Sean Clayton, Ivan Wong, Alex Loomis
const db = require("../db/connection");

async function getOfficeData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT office_name, 
                CONCAT(street, ', ', city, ', ', state, ' ', zip) AS location, 
                phone_number 
         FROM Office`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

module.exports = getOfficeData;
