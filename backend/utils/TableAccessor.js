module.exports = class TableAccessor {
  constructor(tableName, db) {
    this.table = tableName;
    this.db = db;
  }

  get(column, value, limit=1) {
    return this.db._dbRequest(
      `SELECT * FROM ${this.table} WHERE ${column} = (?) LIMIT ${limit}`,
      [value]
    );
  }

  delete(id) {
    return this.db._dbRequest(
      `DELETE FROM ${this.table} WHERE id = (?)`,
      [id]
    );
  }

  update(id, data) {
    const columnArray = Object.keys(data).map(key => `${key} = (?)`);
    return this.db._dbRequest(`UPDATE ${this.table} SET ${columnArray.toString()} WHERE id = (?)`, [...Object.values(data),id])
  }

  create(data) {
    const columnArray = Object.keys(data);
    const valueArray = Object.values(data);
    let questionMarkArray = new Array(columnArray.length).fill("?")
    return this.db._dbRequest(
      `INSERT IGNORE INTO ${this.table} (${columnArray.toString()}) VALUES (${questionMarkArray.toString()})`,
      valueArray
    );
  }

  get all() {
    return this.db._dbRequest(`SELECT * FROM ${this.table}`);
  }
};
