const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uri = "mongodb://localhost... OR mongodb+srv://user_Or_password....";

const connection = mongoose.createConnection(uri);

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = connection.model("User", userSchema);
