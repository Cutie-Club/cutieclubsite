const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { secretKey } = require('../config.json');
const newToken = user =>
  jwt.sign({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    admin: user.admin
  }, secretKey, {
    expiresIn: "1h"
  });

const generateHash = password => {
  return argon2.hash(password, {
    type: argon2.argon2id
    // memoryCost: 2 ** 16,
    // parallelism: 4,
    // hashLength: 64,
    // saltLength: 32,
  });
};

module.exports = (app, upload, db) => {
  const users = db.get("users");
  app.post("/newuser", upload.single("image"), async (req, res) => {
    const url = "http://" + req.get("host");
    let newBody = { ...req.body };
    if (req.file) newBody["image"] = `${url}/${req.file.filename}`;

    let hash = await generateHash(newBody.password);
    newBody["pw_hash"] = hash;
    delete newBody.password;

    let responseContent = {};
    let user = await users.get("email", newBody.email);
    if (user[0]) responseContent.email = true;

    user = await users.get("username", newBody.username);
    if (user[0]) responseContent.username = true;

    if (responseContent.username || responseContent.email) {
      res.status(409); // the request could not be processed because of conflict
    } else {
      let dbState = await users.create(newBody);

      res.status(201); // the creation of a new resource was successful
      let user = {
        id: dbState.insertId,
        ...newBody,
        admin: 0
      };
      responseContent.token = newToken(user);
    }
    return res.json(responseContent);
  });

  app.post("/login", upload.none(), async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let responseContent = {
      token: undefined,
      error: false
    };

    let user = await users.get("username", username);

    if (!user[0]) {
      res.status(401); // incorrect credentials
      res.setHeader("WWW-Authenticate", 'Basic realm="Access to user area"');
      responseContent.error = true;
    } else {
      try {
        let result = await argon2.verify(user[0].pw_hash, password);

        if (!result) {
          res.status(401); // incorrect credentials
          res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Access to user area"'
          );
          responseContent.error = true;
        } else {
          res.status(200); // OK!
          log.info(`successful login for ${username}`);
          responseContent.token = newToken(user[0]);
        }
      } catch (err) {
        log.error(err);
        res.status(500);
        responseContent.error = true;
      }
    }
    return res.json(responseContent);
  });
};
