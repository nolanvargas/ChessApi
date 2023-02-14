const mongoose = require("mongoose");

// const chessSchema = { test: String };

// module.exports = mongoose.model("Chess", chessSchema);

const ChessBoardSchema = new mongoose.Schema({
  board: [
    {
      location: String,
      piece: String,
    },
  ],
});

module.exports = mongoose.model("ChessBoards", ChessBoardSchema);
