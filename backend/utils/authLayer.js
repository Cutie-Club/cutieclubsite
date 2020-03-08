const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  req.user = {
    admin:false
  }

  if (req.headers.authorization) {
    let rawToken = req.headers.authorization.split(" ")[1];
    console.log(rawToken);
    let decodedToken = jwt.verify(rawToken, `${process.env.secretKey}`);
    console.log(decodedToken);
    req.user = decodedToken;
  }

  next();
}
