const TableAccessor = require("./TableAccessor.js");
const db = {
  _dbRequest: () => {
    return new Promise(resolve => {
      resolve("queryResult");
    });
  }
};

const tableName = "table";
const id = 7;
const data = {
  name: "test",
  description : "a test description"
}

let table;

beforeEach(() => {
  table = new TableAccessor(tableName, db);
  jest.spyOn(table.db, "_dbRequest");
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("TableAccessor constructs correctly", () => {
  test("Table property is set correctly", () => {
    expect(table.table).toStrictEqual(tableName);
  });

  test("Database property is set correctly", () => {
    expect(table.db).toStrictEqual(db);
  });
});

describe("get() executes correctly", () => {
  test("get() calls _dbRequest with an SQL Query", () => {
    table.get("column", "value", 7);
    expect(table.db._dbRequest).toHaveBeenCalledWith(
      "SELECT * FROM table WHERE SOUNDEX(?) = SOUNDEX(?) LIMIT (?)",
      ["column", "value", 7]
    );
  });

  test("get() defaults to a limit of 1", () => {
    table.get("column", "value");
    expect(table.db._dbRequest).toHaveBeenCalledWith(
      "SELECT * FROM table WHERE SOUNDEX(?) = SOUNDEX(?) LIMIT (?)",
      ["column", "value", 1]
    );
  });
});

describe("delete() executes correctly", () => {
  test("delete() calls _dbRequest with an SQL Query", () => {
    table.delete(id);
    expect(table.db._dbRequest).toHaveBeenCalledWith(
      "DELETE FROM table WHERE id = (?)",
      [id]
    );
  });
});

describe("update() executes correctly", () => {
  test("update() calls _dbRequest with an SQL Query", () => {
    table.update(id, data);
    expect(table.db._dbRequest).toHaveBeenCalledWith(
      "UPDATE table SET name = (?),description = (?) WHERE id = (?)",
      ["test","a test description", 7]
    );
  });
});

describe("create() executes correctly", () => {
  test("create() calls _dbRequest with an SQL Query", () => {
    table.create(data);
    expect(table.db._dbRequest).toHaveBeenCalledWith(
      "INSERT IGNORE INTO table (name,description) VALUES (?,?)",
      ["test","a test description"]
    );
  });
});

describe("all() executes correctly", () => {
  test("all() calls _dbRequest with an SQL Query", () => {
    table.all;
    expect(table.db._dbRequest).toHaveBeenCalledWith("SELECT * FROM table");
  })
})
