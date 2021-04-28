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
  const user = await User.findOne({ username });
  return !user
};

const isAdmin = async (_id) => {
  const user = await User.findOne({ _id });
  return user.role === ROLES.ADMIN;
};

module.exports = {
  registerValidation,
  loginValidation,
  isUniqueUser,
  isAdmin,
};
