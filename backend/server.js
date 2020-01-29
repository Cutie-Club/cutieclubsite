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

const dbExecute = sql => {
  pool
    .query(sql)
    .then(columns => {
      console.log(columns);
    })
    .catch(err => {
      console.error(err);
    });
};

// create table in db
dbExecute(
  "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT NOT NULL, product_code CHAR(4) NOT NULL, description TEXT NOT NULL)"
);
dbExecute(
  "INSERT IGNORE INTO products VALUES (1, 'Borsdorf', 'BRDF', 'My really cool keyvboard wib alsps')"
);
dbExecute(
  "INSERT IGNORE INTO products VALUES (2, 'Donut', 'DNUT', 'My reallui cool round macro pad')"
);
dbExecute(
  "INSERT IGNORE INTO products VALUES (3, 'Splixty', 'SPLT', '60% split keeb')"
);

// server middleware
app.use(bodyParser.json()); // parse json bodies
app.use(bodyParser.urlencoded({ extended: true })); // parse form bodies
app.use(cors()); // allow cross origin shit (probs turn off in prod)

// server routes
app.post("/products", (req, res) => {
  console.log(req.body);
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

app.post("/products/new", (req, res) => {
  console.log(req.body);
  pool
    .query(
      "INSERT IGNORE INTO products (name, product_code, description) VALUES ( ?, ?, ? )",
      [req.body.name, req.body.product_code, req.body.description]
    )
    .then(queryResult => {
      res.json(queryResult);
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

app.patch("/products/:id", (req, res) => {
  pool
    .query(
      "UPDATE products SET name = (?), product_code = (?), description = (?) WHERE id = (?)",
      [
        req.body.name,
        req.body.product_code,
        req.body.description,
        req.params.id
      ]
    )
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
