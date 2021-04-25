// imports
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User");
const router = express.Router();

// Validation
const {
  registerValidation,
  isUniqueUser,
  loginValidation,
} = require("./validation");

// utils
const { handleValidationError } = require("../etc/utils");

// Middlewares
const verifyToken = require("../middlewares/verifyToken");

router.get("/", async (req, res) => {
  const userList = await User.find().select(["-password", "-__v"]);
  res.send(userList);
});

router.post("/register", async (req, res) => {
  // Validate data
  const { error } = registerValidation(req.body);
  handleValidationError(error, res);

  // Extract user data
  const { username, password } = req.body;

  // Validate user uniqueness
  const isUnique = await isUniqueUser(username);
  if (!isUnique) res.status(400).send("user already exists");

  // Password hashing
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
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  handleValidationError(error, res);

  try {
    // Get user
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) res.status(404).send("user does not exist");

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) res.status(401).send("invalid password");

    // login successful
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.send({ token });
  } catch (err) {
    console.log("err");
  }
});

// set user score
router.post(
  `/${process.env.SECRET_SCORE_ENDPOINT}`,
  verifyToken,
  async (req, res) => {
    const token = req.header("auth-token");
    const { _id } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ _id });
    if (!user) res.status(404).send("user not found");

    // Get score data
    const score = req.body[process.env.SECRET_SCORE_PARAM];
    if (!score) res.status(400).send("no score provided");

    user.score = score;

    try {
      const userData = await user.save();
      res.send(userData);
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
