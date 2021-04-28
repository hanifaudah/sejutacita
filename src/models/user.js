// imports
const mongoose = require("mongoose");
const { ROLES } = require("../etc/constants");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: ROLES.USER,
    enum: [...Object.values(ROLES)],
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
