const { ROLES, ERRORS } = require("../etc/constants")
const { isAdmin: isAdminValidation } = require("../routes/validation")

// models
const User = require("../models/user")

const adminOnly = async (req, res, next) => {
  const { _id } = req.user
  const isAdmin = await isAdminValidation(_id)
  if (isAdmin) next()
  else res.status(401).send({
    message: ERRORS.UNAUTHORIZED 
  })
};

module.exports = adminOnly;