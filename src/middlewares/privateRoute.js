const User = require("../models/user");
const { ERRORS } = require("../etc/constants")
const { isAdmin } = require("../routes/validation")

const privateRoute = (userIdParamName) => {
  return async (req, res, next) => {
    const { _id } = req.user;
    const userIdParam = req.params[userIdParamName]
    if (_id === userIdParam || await isAdmin(_id)) next()
    else res.status(401).send({
      message: ERRORS.UNAUTHORIZED
    })
  };
}

module.exports = privateRoute
