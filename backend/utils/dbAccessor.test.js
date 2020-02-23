const dbAccessor = require("./dbAccessor.js");
const TableAccessor = require("./TableAccessor.js");
const dbConfig = {
  host: "hostname",
  user: "username",
  password: "password",
  database: "mydb"
};

const mariadb = require("mariadb");
jest.mock("mariadb");

let db;
beforeEach(() => {
  mariadb.createPool.mockReturnValue({
    query: jest.fn(() => new Promise(resolve => {
			resolve({ result: "test" });
		}))
  });
	db = new dbAccessor(dbConfig);
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("dbAccessor constructs correctly", () => {
  test("mariadb.createPool is called once", () => {
    expect(mariadb.createPool).toHaveBeenCalledTimes(1);
  });
  test("mariadb.createPool is setup with the supplied config", () => {
    expect(mariadb.createPool).toHaveBeenCalledWith(dbConfig);
  });
});

describe("_dbRequest() executes correctly", () => {
  test("_dbRequest() returns a promise", () => {
    expect(db._dbRequest("TEST QUERY")).resolves.toStrictEqual({
      result: "test"
    });
  });

  test("_dbRequest() calls pool.query", () => {
    db._dbRequest("TEST QUERY");
    expect(db.pool.query).toHaveBeenCalledTimes(1);
  });
});

describe("get() executes correctly", () => {
	test("get() returns successfully", () => {
    jest.spyOn(db, "get");
    db.get("table");
    expect(db.get).toHaveReturnedTimes(1);
  })

	test("get() returns a new TableAccessor", () => {
		expect(db.get("table")).toBeInstanceOf(TableAccessor);
	})
});

describe("create() executes successfully", () => {
	test("create() is called correctly", () => {
		jest.spyOn(db, "_dbRequest");
		db.create("table", ["test","fields","here"], false);
		expect(db._dbRequest).toHaveBeenCalledWith(
			"CREATE TABLE IF NOT EXISTS table (id INTEGER PRIMARY KEY AUTO_INCREMENT,test,fields,here)"
		);
	})
});

describe("delete() executes successfully", () => {
	test("delete() is called correctly", () => {
		jest.spyOn(db, "_dbRequest");
		db.delete("table");
		expect(db._dbRequest).toHaveBeenCalledWith("DROP TABLE table");
	})
});
