const { dbConfig, uploadConfig } = require("./config.json");
const express = require("express");
const mariadb = require("mariadb");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors"); // cross origin resource sharing

const app = express();
const port = 9001;
const pool = mariadb.createPool(dbConfig);

const storage = multer.diskStorage({
  destination: "./public/",
  filename: function(req, file, cb) {
    let fileName = file.originalname.split(".", 1);
    let fileExt = file.mimetype.split("/")[1];
    cb(null, `${fileName}-${Date.now()}.${fileExt}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    let fileExt = file.mimetype.split("/")[1];
    console.log(fileExt);
    if (!uploadConfig.validExts.includes(fileExt)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
});

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
app.use(cors()); // allow cross origin resource sharing (probs turn off in prod)
app.use(express.static("public")); // public file folder

// server routes
app.post("/products", upload.none(), (req, res) => {
  searchQuery = req.body.query;
  pool
    .query("SELECT * FROM products WHERE SOUNDEX(name) = SOUNDEX( ? )", [
      searchQuery
    ])
    .then(columns => {
      columns.forEach(item => {
        res.json(item);
      });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/products", upload.none(), (req, res) => {
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

app.delete("/products/:id", upload.none(), (req, res) => {
  pool
    .query("DELETE FROM products WHERE id = (?)", [req.params.id])
    .then(queryResult => {
      res.json(queryResult);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/products/new", upload.single("image"), (req, res) => {
  if (!req.file) {
    throw new Error("File not passed");
  }

  let keyList = "";
  let valueList = "";
  Object.entries(req.body).forEach(([key, value], index) => {
    keyList += `${key}, `;
    valueList += `"${value}", `;
  });

  const url = "http://" + req.get("host");
  keyList += `image`;
  valueList += `"${url}/${req.file.filename}"`;

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

app.patch("/products/:id", upload.single("image"), (req, res) => {
  let newData = req.body;
  if (req.file) {
    console.log("file uploaded");
    newData.image = `http://${req.get("host")}/${req.file.filename}`;
  }

  console.log(newData);

  let sqlQuery = "UPDATE products SET ";
  Object.entries(newData).forEach(([key, value], index) => {
    sqlQuery += `${key} = "${value}"`;
    if (index !== Object.keys(req.body).length - 1) {
      sqlQuery += ", ";
    }
  });
  sqlQuery += ` WHERE id = "${req.params.id}"`;

  console.log(sqlQuery);
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
