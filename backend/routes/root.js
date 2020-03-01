const jwt = require("jsonwebtoken");
const secretKey = "cutie club";
const argon2 = require('argon2');

const newToken = (id, username) =>
  jwt.sign({ id: id, user: username }, secretKey, {
    expiresIn: "1h"
  });

const generateHash = (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    // memoryCost: 2 ** 16,
    // parallelism: 4,
    // hashLength: 64,
    // saltLength: 32,
  });
};

module.exports = (app, upload, db) => {
  const users = db.get("users");
  app.post("/newuser", upload.single("image"), (req, res) => {
    const url = "http://" + req.get("host");
    // validate data
    // check it an email, maybe send an email to check it exists
    // check password meets requirements
    // check email unique
    // check username unique
    // run through file processer
    let newBody = { ...req.body };
    if (req.file) {
      newBody["image"] = `${url}/${req.file.filename}`;
    }

    generateHash(newBody.password).then(hash => {
      newBody["pw_hash"] = hash;
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
  });

  // TODO:
  // output from create/login
  // {status: "success", data: "token"}
  // {status: "error", data: "error message"}

  app.post("/login", upload.none(), (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users.get("username", username).then(([user]) => {
      if (!user) {
        return console.warn(`no user found matching ${username}`);
        // inform user that username wasn't found
      }
      argon2.verify(user.pw_hash, password).then((result) => {
        if (!result) {
          return console.warn(`login failure for ${username}!`);
          // to frontend: inform user of a layer 8 error
        }
        console.log(`successful login for ${username}`);
        return res.send(newToken(user.id, username));
      })
    });
  });

  app.post("/adminSecrets", upload.none(), (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let decodedToken = jwt.verify(token, secretKey);
    console.log(decodedToken);
    res.send("HELLO ADMIN");
  });
};
