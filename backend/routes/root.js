const jwt = require("jsonwebtoken");
const secretKey = "cutie club";
const newToken = (id, username) =>
  jwt.sign({ id: id, user: username }, secretKey, {
    expiresIn: "1h"
  });

module.exports = (app, upload, db) => {
  const users = db.get("users");

  app.post("/newuser", upload.single("image"), (req, res) => {
    const url = "http://" + req.get("host");
    // validate data
    // add to db
    let newBody = { ...req.body };
    if (req.file) {
      newBody["image"] = `${url}/${req.file.filename}`;
    }
    newBody["pw_hash"] = newBody.password;
    delete newBody.password;

    users.get("email", newBody.email).then(user => {
      if (user[0]) {
        console.log("tthois users aalreddi exists :/");
        return res.send("EXISTS");
      }
      users.create(newBody).then(result => {
        console.log(result);
        return res.send(newToken(result.insertId, newBody.username));
      });
    });
  });

  app.post("/login", upload.none(), (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users.get("username", username).then(([user]) => {
      if (!user) {
        return console.warn(`no user found matching ${username}`);
      }
      if (password !== user.pw_hash) {
        return console.warn(`login failure for ${username}!`);
      }
      console.log(`successful login for ${username}`);
      return res.send(newToken(user.id, username));
    });
  });

  app.post("/adminSecrets", upload.none(), (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let decodedToken = jwt.verify(token, secretKey);
    console.log(decodedToken);
    res.send("HELLO ADMIN");
  });
};
