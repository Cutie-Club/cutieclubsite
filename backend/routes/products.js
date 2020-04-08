const fs = require("fs");

module.exports = (app, upload, db) => {
  const products = db.get("products");

  const authError = res => {
    res.status(403);
    res.setHeader(
      "WWW-Authenticate",
      `Bearer realm="Access to products" error="insufficient_scope" error_description="Administrator rights required"`
    );
    res.json({
      error: true
    });
  };

  app.get("/products", upload.none(), (req, res) => {
    products.all.then(items => {
      res.json({ rows: items });
    });
  });

  app.post("/products", upload.none(), (req, res) => {
    products.get("name", req.body.query).then(item => {
      res.json(item);
    });
  });

  app.delete("/products/:id", upload.none(), (req, res) => {
    if (!req.user.admin) return authError(res);
    products.delete(req.params.id).then(item => {
      res.json(item);
    });
  });

  app.post("/products/new", upload.single("image"), (req, res) => {
    if (!req.user.admin) return authError(res);
    if (!req.file) throw new Error("File not passed");
    const url = "http://" + req.get("host");

    fs.rename(req.file.path, `./public/${req.body.name}-thumb`, (err) => {
      if (err) throw err
      log.debug('Successfully renamed - AKA moved!')
    })

    // console.log(req.file);
    log.debug(req.body.name);

    let newBody = { ...req.body };
    newBody["image"] = `${url}/${req.body.name}-thumb`;

    products.create(newBody).then(item => {
      db.create(req.body.code, [
        "version INTEGER NOT NULL",
        "batch INTEGER NOT NULL",
        "serial_id INTEGER NOT NULL",
        "image TEXT NOT NULL",
        "information TEXT",
        "timestamp DATETIME"
      ]).then(() => {
        res.json(item);
      });
    });
  });

  app.patch("/products/:id", upload.single("image"), (req, res) => {
    if (!req.user.admin) return authError(res);
    let newData = req.body;
    if (req.file) {
      newData.image = `http://${req.get("host")}/${req.file.filename}`;
    }
    products.update(req.params.id, newData).then(item => {
      res.json(item);
    });
  });
};
