const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db.sqlite');

const getSql = (query) => {
  return new Promise((resolve, reject) => {
    console.log(query.text);
    console.log(query.values);
    db.all(query.text, query.values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.db = db;
exports.getSql = getSql;