module.exports = class TableAccessor {
  constructor(tableName, pool) {
    this.table = tableName;
    this.pool = pool;
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
        });
    });
  }

  get(column, value, limit=1) {
    return this._dbRequest(
      `SELECT * FROM ${this.table} WHERE SOUNDEX(?) = SOUNDEX(?) LIMIT ?`,
      [column, value, limit]
    );
  }

	delete(id) {
		return this._dbRequest(
			`DELETE FROM ${this.table} WHERE id = (?)`,
			[id]
		);
	}

	update(id, data) {
		let columnArray = [];
		Object.keys(data).forEach((key, index) => {
			columnArray.push(`${key} = (?)`);
		});
		return this._dbRequest(`UPDATE ${this.table} SET ${columnArray.toString()} WHERE id = (?)`, [...Object.values(data),id])
	}

	create(data) {
		const columnArray = Object.keys(data);
 		const valueArray = Object.values(data);
		let questionMarkArray = new Array(columnArray.length).fill("?")
		return this._dbRequest(
			`INSERT IGNORE INTO ${this.table} (${columnArray.toString()}) VALUES (${questionMarkArray.toString()})`,
		valueArray
		);
	}

  get all() {
    return this._dbRequest(`SELECT * FROM ${this.table}`);
  }
};
