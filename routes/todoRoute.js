const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");

router.post("/additem", async (req, res) => {
  const { userid, text } = req.body;
  // console.log("req.body", req.body);
  const user = await User.findById(userid);
  // console.log("user in additem route", user);
  if (!user) {
    res.send({ status: 404, message: "user not found" });
  } else {
    user.todos.push({ text });
    const updatedDoc = await user.save();
    res.send({ status: 200, message: "item added", todos: updatedDoc.todos });
  }
});

router.post("/updateitem", async (req, res) => {
  const { id, isCompleted } = req.body;
  const user = await User.findOneAndUpdate(
    { "todos._id": id },
    { $set: { "todos.$.isCompleted": !isCompleted } },
    { returnNewDocument: true, returnDocument: "after" }
  );
  if (!user) return res.send({ status: 404, message: "error occured" });
  // console.log(user, "this was user");
  return res.send({
    status: 200,
    message: "field updated",
    todos: user.todos,
  });
});

router.post("/deleteitem", async (req, res) => {
  const { userid, todoid } = req.body;
  var user = await User.findByIdAndUpdate(
    userid,
    { $pull: { todos: { _id: todoid } } },
    { returnNewDocument: true, returnDocument: "after" }
  );
  // console.log("user", user);
  res.send({
    status: 200,
    message: "document deleted",
    todos: user.todos,
  });
});

module.exports = router;
