const { dbConfig, uploadConfig } = require("./config.json");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors"); // cross origin resource sharing
const dbAccessor = require("./utils/dbAccessor.js");

const app = express();
const port = 9001;
const db = new dbAccessor(dbConfig);

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
    if (!uploadConfig.validExts.includes(fileExt)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
});

// server middleware
app.use(bodyParser.json()); // parse json bodies
app.use(bodyParser.urlencoded({ extended: true })); // parse form bodies
app.use(cors()); // allow cross origin resource sharing (probs turn off in prod)
app.use(express.static("public")); // public file folder

// server routes
require('./routes/root.js')(app, upload, db);
require('./routes/products.js')(app, upload, db);

// server start
app.listen(port, () =>
  console.log(
    `being cute on the internet (port ${port}!) at ${new Date().toUTCString()}`
  )
);

// create table for products
db.create("products", [
  "name TEXT NOT NULL",
  "code TEXT NOT NULL",
  "blurb TEXT NOT NULL",
  "image TEXT NOT NULL"
]);

// create table for a product family
db.create("BRDF", [
  "version INTEGER NOT NULL",
  "batch INTEGER NOT NULL",
  "serial_id INTEGER NOT NULL",
  "image TEXT NOT NULL",
  "information TEXT",
  "timestamp DATETIME"
]);

db.create("product_images", [
  "product_id INTEGER NOT NULL",
  "location TEXT NOT NULL",
  "FOREIGN KEY (product_id) REFERENCES products(id)"
]);

db.create("users", [
  "username TEXT NOT NULL UNIQUE",
  "email TEXT NOT NULL UNIQUE",
  "pw_hash TEXT NOT NULL",
  "display_name TEXT",
  "image TEXT"
])

const products = db.get("products");

products.create({
  id: 1,
  name: "Borsdorf",
  code: "BRDF",
  blurb: "66% Alps Keyboard",
  image: "http://localhost:9001/borsdorf-1582360923172.jpeg"
});

products.create({
  id: 2,
  name: "Donut",
  code: "DNUT",
  blurb: "My reallui cool round macro pad",
  image: "http://localhost:9001/IMG_7925-1582359756755.jpeg"
});

products.create({
  id: 3,
  name: "Splixty",
  code: "SPLT",
  blurb: "60% split keeb",
  image: "http://localhost:9001/hello-1582360938851.png"
});
