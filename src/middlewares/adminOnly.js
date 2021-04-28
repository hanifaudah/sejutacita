const { ROLES, ERRORS } = require("../etc/constants")

// models
const User = require("../models/user")

const adminOnly = async (req, res, next) => {
  const user = req.user
  const role = await User.findOne({ username: user.username });
  const isAdmin = role === ROLES.ADMIN;
  
  if (isAdmin) next()
  else res.status(401).send({
    message: ERRORS.UNAUTHORIZED 
  })
};

module.exports = adminOnly;