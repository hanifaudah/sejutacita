// imports
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middlewares = require("../middlewares");
const { ERRORS } = require("../etc/constants");
const config = require("../config");
const {
  registerValidation,
  isUniqueUser,
  loginValidation,
} = require("./validation");
const {
  handleValidationError,
  getServerErrorResponse,
  getErrorResponseFormat,
} = require("../etc/utils");

// models
const User = require("../models/user");

// router
const router = express.Router();

// @GET /users/:userId
router.get("/:userId", middlewares.verifyToken, async (req, res) => {
  const { userId } = req.params;
  // get all users
  if (userId) {
    const userList = await User.find().select(["-password", "-__v"]);
    res.send(userList);
  }
  // get user by id
  else {
    const userById = await User.findOne({ _id: userId });
    if (!userById)
      res.status(400).send(getErrorResponseFormat(ERRORS.USER_NOT_FOUND));
    else res.send(userById);
  }
});

// @PATCH /users/:userId
router.patch(
  "/:userId",
  [middlewares.verifyToken, middlewares.privateRoute("userId")],
  async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user)
      res.status(400).send(getErrorResponseFormat(ERRORS.USER_NOT_FOUND));
    else {
      user = {
        ...user,
        ...req.body,
      };
      try {
        const data = await user.save();
        res.send(data);
      } catch (err) {
        res.send(500).send(getServerErrorResponse(err));
      }
    }
  }
);

// @POST /users/register/
router.post("/register", async (req, res) => {
  // Validate data
  const { error } = registerValidation(req.body);
  handleValidationError(error, res);

  // extract user data
  const { username, password } = req.body;

  // validate user uniqueness
  const isUnique = await isUniqueUser(username);
  if (!isUnique)
    res.status(400).send(getErrorResponseFormat(ERRORS.USERNAME_EXISTS));

  // password hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    const data = await newUser.save();
    res.send(data);
  } catch (err) {
    res.send(500).send(getServerErrorResponse(err));
  }
});

// @POST /users/login/
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  handleValidationError(error, res);

  try {
    // Get user
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) res.status(404).send(ERRORS.USER_NOT_FOUND);

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) res.status(401).send(ERRORS.INVALID_PASSWORD);

    // login successful
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: config.tokenLifeSpan,
    });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: config.refreshTokenLifeSpan,
    });
    res.send({ token, refreshToken });
  } catch (err) {
    res.send(500).send(getServerErrorResponse(err));
  }
});

// @POST /users/refresh-token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  const verifiedUser = jwt.verify(refreshToken, process.env.SECRET_KEY);
  if (!verifiedUser)
    res.status(401).send({
      message: ERRORS.UNAUTHORIZED,
    });
  else {
    const token = jwt.sign({ ...verifiedUser }, process.env.SECRET_KEY, {
      expiresIn: config.tokenLifeSpan,
    });
    res.send({ token });
  }
});

// Admin only routes

// @DELETE /users/:userId
router.delete(
  "/:userId",
  [middlewares.verifyToken, middlewares.adminOnly],
  async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user)
      res.status(400).send(getErrorResponseFormat(ERRORS.USER_NOT_FOUND));
    else {
      try {
        const data = await user.delete();
        res.send({
          message: `${user.username} has been deleted`,
        });
      } catch (err) {
        res.send(500).send(getServerErrorResponse(err));
      }
    }
  }
);

module.exports = router;
