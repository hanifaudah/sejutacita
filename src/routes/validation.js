// imports
const joi = require("@hapi/joi");

const User = require("../models/user");

const { ROLES } = require("../etc/constants");

const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const isUniqueUser = async (username) => {
  const usernameExists = await User.findOne({ username });
  return !usernameExists;
};

const isAdmin = async (username) => {
  const role = await User.findOne({ username });
  return role === ROLES.ADMIN;
};

module.exports = {
  registerValidation,
  loginValidation,
  isUniqueUser,
  isAdmin,
};
