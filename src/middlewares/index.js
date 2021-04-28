const verifyToken = require("./verifyToken");
const adminOnly = require("./adminOnly");
const privateRoute = require("./privateRoute");

module.exports = {
  verifyToken,
  adminOnly,
  privateRoute,
};
