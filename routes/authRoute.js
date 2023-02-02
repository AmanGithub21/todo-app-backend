const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser)
    return res.send({ status: 404, message: "Invalid crediential" });
  if (existingUser.password != password)
    return res.send({ status: 404, message: "Invalid crediential" });
  // console.log("login route user", existingUser);
  return res.send({
    status: 200,
    message: "user loggedIn",
    userid: existingUser.id,
    todos: existingUser.todos,
  });
});

router.post("/register", async (req, res) => {
  const { username, password, securityquestion, securityanswer } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send({ status: 404, message: "username already exist" });
  }
  const newUser = await User(req.body);
  const user = await newUser.save();
  res.send({
    status: 200,
    message: "user created",
    userid: user.id,
    todos: user.todos,
  });
});

router.post("/forgotpassword", async (req, res) => {
  const { username, securityquestion, securityanswer } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.send({ status: 404, message: "user not verified" });
  }
  if (
    user.securityanswer != securityanswer ||
    user.securityquestion != securityquestion
  ) {
    return res.send({ status: 404, message: "user not verified" });
  }
  return res.send({ status: 200, message: "user verified", userid: user.id });
});

router.post("/resetpassword", async (req, res) => {
  const { password, userid } = req.body;
  const user = await User.findByIdAndUpdate(
    userid,
    {
      $set: { password },
    },
    { returnNewDocument: true, returnDocument: "after" }
  );
  if (!user) {
    return res.send({ status: 404, message: "user not found" });
  }
  return res.send({ status: 200, message: "password reset successfull" });
});

module.exports = router;
