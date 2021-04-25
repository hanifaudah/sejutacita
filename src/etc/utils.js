const jwt = require("jsonwebtoken");

const handleValidationError = (error, response) => {
  if (error) response.status(400).send(error.details[0].message);
};

const getTokenPayload = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = {
  handleValidationError,
};
