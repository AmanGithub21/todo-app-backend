const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  todos: [
    {
      text: {
        type: String,
        require: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  securityquestion: {
    type: String,
    require: true,
  },
  securityanswer: {
    type: String,
    requrie: true,
  },
});

module.exports = mongoose.model("User", userSchema);
