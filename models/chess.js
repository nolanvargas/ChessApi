const mongoose = require('mongoose');
const ChessBoardSchema = new mongoose.Schema({
  board: [
    {
      location: String,
      piece: String,
    },
  ],
});

module.exports = mongoose.model('ChessBoards', ChessBoardSchema);
