const { dbConfig } = require("./config.json");
const express = require("express");
const mariadb = require("mariadb");
const bodyParser = require("body-parser");
const cors = require("cors"); // cross origin resource sharing

const app = express();
const port = 9001;
const pool = mariadb.createPool(dbConfig);

// setup db connection
pool
  .getConnection()
  .then(conn => {
    console.log("connected ! connection id is " + conn.threadId);
    conn.release(); //release to pool
  })
  .catch(err => {
    console.error("not connected due to error: " + err);
  });

const dbExecute = (sql, args = []) => {
  pool
    .query(sql, args)
    .then(columns => {
      console.log(columns);
    })
    .catch(err => {
      console.error(err);
    });
};

// DELETE EVERYTHING
// dbExecute(`DROP TABLE product_images, products`);

// create table for products
dbExecute(
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    blurb TEXT NOT NULL,
		image TEXT NOT NULL
	)
  `
);

// create table for a product family
const productCode = "BRDF";
dbExecute(
  `CREATE TABLE IF NOT EXISTS ${productCode} (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    version INTEGER NOT NULL,
    batch INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    information TEXT,
    timestamp DATETIME
  )`
);

dbExecute(
  `CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    product_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`
);

dbExecute(
  "INSERT IGNORE INTO products VALUES (1, 'Borsdorf', 'BRDF', 'My really cool keyvboard wib alsps', 'http://localhost:9001/borsdorf.png')"
);
dbExecute(
  "INSERT IGNORE INTO products VALUES (2, 'Donut', 'DNUT', 'My reallui cool round macro pad', 'http://localhost:9001/donut.jpg')"
);
dbExecute(
  "INSERT IGNORE INTO products VALUES (3, 'Splixty', 'SPLT', '60% split keeb', 'http://localhost:9001/borsdorf.png')"
);

// server middleware
app.use(bodyParser.json()); // parse json bodies
app.use(bodyParser.urlencoded({ extended: true })); // parse form bodies
app.use(cors()); // allow cross origin shit (probs turn off in prod)
app.use(express.static("public")); // public file folder

// server routes
app.post("/products", (req, res) => {
  searchQuery = req.body.query;
  pool
    .query("SELECT * FROM products WHERE SOUNDEX(name) = SOUNDEX( ? )", [
      searchQuery
    ])
    .then(columns => {
      columns.forEach(item => {
        console.log(item);
        res.json(item);
      });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/products", (req, res) => {
  pool
    .query("SELECT * FROM products")
    .then(queryResult => {
      let newJSON = { rows: queryResult };
      res.json(newJSON);
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete("/products/:id", (req, res) => {
  pool
    .query("DELETE FROM products WHERE id = (?)", [req.params.id])
    .then(queryResult => {
      res.json(queryResult);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/products/new", (req, res) => {
  console.log(req.body);
  let keyList = "";
  let valueList = "";
  Object.entries(req.body).forEach(([key, value], index) => {
    keyList += key;
    valueList += `"${value}"`;
    if (index !== Object.keys(req.body).length - 1) {
      keyList += ", ";
      valueList += ", ";
    }
  });

  let sqlQuery = `INSERT IGNORE INTO products (${keyList}) VALUES (${valueList})`;

  pool
    .query(sqlQuery)
    .then(queryResult => {
      res.json(queryResult);
    })
    .catch(err => {
      console.error(err);
    });
});

app.patch("/products/:id", (req, res) => {
  let sqlQuery = "UPDATE products SET ";
  Object.entries(req.body).forEach(([key, value], index) => {
    sqlQuery += `${key} = "${value}"`;
    if (index !== Object.keys(req.body).length - 1) {
      sqlQuery += ", ";
    }
  });
  sqlQuery += ` WHERE id = "${req.params.id}"`;

  pool
    .query(sqlQuery)
    .then(queryResult => {
      res.json(queryResult);
    })
    .catch(err => {
      console.error(err);
    });
});

// server start
app.listen(port, () =>
  console.log(
    `being cute on the internet (port ${port}!) at ${new Date().toUTCString()}`
  )
);
