module.exports = (app, upload, db) => {
	const products = db.get("products");

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
		products.delete(req.params.id).then(item => {
			res.json(item);
		});
	});

	app.post("/products/new", upload.single("image"), (req, res) => {
		if (!req.file) {
			throw new Error("File not passed");
		}
		const url = "http://" + req.get("host");

		let newBody = {...req.body};
		newBody["image"] = `${url}/${req.file.filename}`;

		products.create(newBody).then(item => {
			res.json(item);
		});
	});

	app.patch("/products/:id", upload.single("image"), (req, res) => {
		let newData = req.body;
		if (req.file) {
			newData.image = `http://${req.get("host")}/${req.file.filename}`;
		}
		products.update(req.params.id, newData).then(item => {
			res.json(item);
		});
	});
}
