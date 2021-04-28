const jwt = require("jsonwebtoken");
const { ERRORS } = require("../etc/constants");

const handleValidationError = (error, response) => {
  if (error) response.status(400).send(error.details[0].message);
};

const getErrorResponseFormat = (errorMessage) => {
  return {
    message: errorMessage,
  };
};

const getServerErrorResponse = (errorMessage) => {
  return process.env.DEBUG === "TRUE" ? errorMessage : ERRORS.PROD_SERVER_ERROR;
};

// const getTokenPayload = (token) => {
//   return jwt.verify(token, process.env.SECRET_KEY);
// };

module.exports = {
  handleValidationError,
  getServerErrorResponse,
  getErrorResponseFormat,
};
