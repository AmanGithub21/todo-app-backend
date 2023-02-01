const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/todoDB";

mongoose
  .set("strictQuery", true)
  .connect(dbUrl)
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log("DB NOT CONNECTED", e);
  });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "Here i am at backend" });
});

app.post("/additem", async (req, res) => {
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

app.post("/updateitem", async (req, res) => {
  const { id, isCompleted } = req.body;
  const user = await User.findOneAndUpdate(
    { "todos._id": id },
    { $set: { "todos.$.isCompleted": !isCompleted } },
    { returnNewDocument: true, returnDocument: "after" }
  );
  if (!user) return res.send({ status: 404, message: "error occured" });
  console.log(user, "this was user");
  return res.send({
    status: 200,
    message: "field updated",
    todos: user.todos,
  });
});

app.post("/deleteitem", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser)
    return res.send({ status: 404, message: "Invalid crediential" });
  if (existingUser.password != password)
    return res.send({ status: 404, message: "Invalid crediential" });
  console.log("login route user", existingUser);
  return res.send({
    status: 200,
    message: "user loggedIn",
    userid: existingUser.id,
    todos: existingUser.todos,
  });
});

app.post("/register", async (req, res) => {
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

app.post("/forgotpassword", (req, res) => {});

app.listen(8080, (req, res) => {
  console.log("Server running on Port 8080");
});
