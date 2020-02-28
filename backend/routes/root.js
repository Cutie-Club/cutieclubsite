const jwt = require('jsonwebtoken');
const secretKey = "cutie club";

module.exports = (app, upload) => {
  app.post("/login", upload.none(), (req, res) => {
    console.log(req.body);
    let token = jwt.sign({ user: req.body.username }, secretKey, { expiresIn: '1h' });
    res.send(token);
  })

  app.post("/adminSecrets", upload.none(), (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let decodedToken = jwt.verify(token, secretKey);
    console.log(decodedToken);
    res.send("HELLO ADMIN");
  })
}
