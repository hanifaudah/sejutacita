const jwt = require("jsonwebtoken");
const { ERRORS } = require("../etc/constants");

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
  getServerErrorResponse,
  getErrorResponseFormat,
};
