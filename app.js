const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const todoRoute = require("./routes/todoRoute");

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

app.use("/", authRoute);
app.use("/", todoRoute);

app.listen(8080, (req, res) => {
  console.log("Server running on Port 8080");
});
