const User = require("../models/user");
const { ERRORS } = require("../etc/constants")

const privateRoute = (userIdParamName) => {
  return (req, res, next) => {
    const user = req.user;
    const userIdParam = req.params[userIdParamName]
    if (user._id === userIdParam) next()
    else res.status(401).send({
      message: ERRORS.UNAUTHORIZED
    })
  };
}

module.exports = privateRoute
