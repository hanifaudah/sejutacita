// imports
const express = require("express");
const middlewares = require("../middlewares");
const { ERRORS, ROLES } = require("../etc/constants");
const {
  getServerErrorResponse,
  getErrorResponseFormat,
} = require("../etc/utils");
const { isAdmin } = require("../routes/validation")

// models
const User = require("../models/user");

// router
const router = express.Router();

// @POST /admin/set-admin
router.post("/set-admin/:userId", [middlewares.verifyToken, middlewares.adminOnly], async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user)
    res.status(400).send(getErrorResponseFormat(ERRORS.USER_NOT_FOUND));
  else if (await isAdmin(userId)) res.status(400).send({
    message: "user is already an admin"
  })
  else {
    user.role = ROLES.ADMIN
    try {
      await user.save();
      res.send({message: `${user.username} is now an admin`});
    } catch (err) {
      res.send(500).send(getServerErrorResponse(err));
    }
  }
})

// @DELETE /admin/remove-admin
router.delete("/remove-admin/:userId", [middlewares.verifyToken, middlewares.adminOnly], async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user)
    res.status(400).send(getErrorResponseFormat(ERRORS.USER_NOT_FOUND));
  else if (user.role !== ROLES.ADMIN) res.status(400).send({
    message: "user is not an admin"
  })
  else {
    user.role = ROLES.USER
    try {
      await user.save();
      res.send({message: `${user.username} is now not an admin`});
    } catch (err) {
      res.send(500).send(getServerErrorResponse(err));
    }
  }
})

module.exports = router;
