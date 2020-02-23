const mariadb = require("mariadb");
const TableAccessor = require("./TableAccessor.js");

module.exports = class dbAccessor {
  constructor(dbConfig) {
    this.pool = mariadb.createPool(dbConfig);
  }

  _dbRequest(query, args = undefined) {
    return new Promise((resolve, reject) => {
      this.pool
        .query(query, args)
        .then(queryResult => {
          resolve(queryResult);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }

  get(table) {
    return new TableAccessor(table, this);
  }

  create(table, fields, idOverride=false) {
    let idColumn = "id INTEGER PRIMARY KEY AUTO_INCREMENT,";
    if (idOverride) {
      idColumn="";
    }
    return this._dbRequest(
      `CREATE TABLE IF NOT EXISTS ${table} (${idColumn}${fields.toString()})`
    )
  }

  delete(table) {
    return this._dbRequest(
      `DROP TABLE ${table}`
    )
  }
};
