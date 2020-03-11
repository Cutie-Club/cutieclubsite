const jwt = require('jsonwebtoken');
const { secretKey } = require('../config.json');

module.exports = (req, res, next) => {
  req.user = {
    admin:false
  }

  if (req.headers.authorization) {
    let rawToken = req.headers.authorization.split(" ")[1];
    let decodedToken = jwt.verify(rawToken, `${secretKey}`);
    req.user = decodedToken;
  }

  next();
}
