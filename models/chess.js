const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chessSchema = new Schema({
  test: String,
});

module.exports = mongoose.model("Chess", chessSchema);
