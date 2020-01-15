const { dbConfig } = require("./config.json");
const express = require("express");
const mariadb = require("mariadb");
const app = express();
const port = 9001;

const pool = mariadb.createPool(dbConfig);

pool
  .getConnection()
  .then(conn => {
    console.log("connected ! connection id is " + conn.threadId);
    conn.release(); //release to pool
  })
  .catch(err => {
    console.error("not connected due to error: " + err);
  });

pool
  .query(
    "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT NOT NULL, product_code CHAR(4) NOT NULL, description TEXT NOT NULL)"
  )
  .then(rows => {
    console.log(rows);
  })
  .catch(err => {
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("hemnlo :3");
});

app.listen(port, () =>
  console.log(`sending hellos on the internet (port ${port}!)`)
);
