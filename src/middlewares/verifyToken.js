const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) res.status(401).send("access denied, no token provided");

  let verifiedUser;
  try {
    verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verifiedUser;
    next();
  } catch (err) {
    if (!verifiedUser) res.status(401).send("invalid token");
  }
};

module.exports = verifyToken;
