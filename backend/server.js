const loggerInit = require("./utils/logger.js");
loggerInit();
log.time("startup");

const { dbConfig, uploadConfig } = require("./config.json");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors"); // cross origin resource sharing
const dbAccessor = require("./utils/dbAccessor.js");
const authentication = require("./utils/authLayer.js");

const app = express();
const port = 9001;
const db = new dbAccessor(dbConfig);

const storage = multer.diskStorage({
  destination: "./temp/uploads",
  filename: (req, file, cb) => {
    let fileName = file.originalname.split(".", 1);
    let fileExt = file.mimetype.split("/")[1];
    cb(null, `${fileName}-${Date.now()}.${fileExt}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let fileExt = file.mimetype.split("/")[1];
    if (!uploadConfig.validExts.includes(fileExt)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
});

// files to host: 
// images
//    products
//    users
// BOMs
// gerbers
// firmwares

// server middleware
app.use(bodyParser.json()); // parse json bodies
app.use(bodyParser.urlencoded({ extended: true })); // parse form bodies
app.use(cors()); // allow cross origin resource sharing (probs turn off in prod)
app.use(express.static("public")); // public file folder
app.use(authentication);

// server routes
require('./routes/root.js')(app, upload, db);
require('./routes/products.js')(app, upload, db);
require('./routes/image.js')(app, upload, db);

// server start
app.listen(port, () => {
  log.time("completed");
  log.info(
    `being cute on the internet (port ${port}!) at ${new Date().toUTCString()}`
  );
  log.timeBetween("startup", "completed");
});

// create table for products
db.create("products", [
  "name TEXT NOT NULL",
  "code TEXT NOT NULL",
  "blurb TEXT NOT NULL",
  "image TEXT NOT NULL",
  "hidden TINYINT(1) NOT NULL DEFAULT 1"
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

db.create("images", [
  "path TEXT NOT NULL UNIQUE", // path for image example: /images/keyboards/wraith.png
  "name TEXT NOT NULL", // image name provided on the website
  "description TEXT NOT NULL", // image description, alt-text / aria label
  "hash TEXT NOT NULL", // image hash
  "hidden TINYINT(1) NOT NULL DEFAULT 1" // hidden
]);

db.create("product_images", [
  "product_id INTEGER NOT NULL",
  "image_id INTEGER NOT NULL",
  "FOREIGN KEY (product_id) REFERENCES products(id)",
  "FOREIGN KEY (image_id) REFERENCES images(id)"
]);

db.create("users", [
  "username TEXT NOT NULL UNIQUE",
  "email TEXT NOT NULL UNIQUE",
  "pw_hash TEXT NOT NULL",
  "display_name TEXT",
  "image TEXT",
  "admin TINYINT(1) NOT NULL DEFAULT 0"
]);

// TODO: create resources table
// db.create("resources") 

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

const images = db.get("images");
images.create({
  id: 1,
  path: "/test.jpg",
  description: "a test image",
  hash: "1234",
  hidden: 0
});

images.create({
  id: 2,
  path: "/test.png",
  description: "a test image",
  hash: "1234",
  hidden: 0
});

images.create({
  id: 3,
  path: "/Example.png",
  description: "a test image",
  hash: "1234",
  hidden: 0
});

images.create({
  id: 4,
  path: "/hidden.png",
  description: "a hidden image",
  hash: "1234",
  hidden: 1
});

const product_images = db.get("product_images");

product_images.create({
  id: 1,
  product_id: 1,
  image_id: 1
});

product_images.create({
  id:2 ,
  product_id: 1,
  image_id: 3
})

product_images.create({
  id: 3,
  product_id: 1,
  image_id: 4
})

product_images.get("product_id", 1, 100).then(console.log)