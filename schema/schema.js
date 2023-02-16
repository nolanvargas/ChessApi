const graphql = require("graphql");
const mongoose = require("mongoose");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const ChessBoardSchema = new mongoose.Schema({
  board: [
    {
      row: Number,
      column: Number,
      piece: String,
      color: String,
    },
  ],
});

const ChessBoardModel = mongoose.model("ChessBoards", ChessBoardSchema);

const PieceType = new GraphQLObjectType({
  name: "Piece",
  fields: () => ({
    _id: { type: GraphQLID },
    row: { type: GraphQLInt },
    column: { type: GraphQLInt },
    piece: { type: GraphQLString },
    color: { type: GraphQLString },
  }),
});

const ChessBoardType = new GraphQLObjectType({
  name: "ChessBoard",
  fields: () => ({
    _id: { type: GraphQLID },
    board: { type: new GraphQLList(PieceType) },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    updatePieceLocation: {
      type: ChessBoardType,
      args: {
        id: { type: GraphQLID },
        piece: { type: GraphQLID },
        row: { type: GraphQLInt },
        column: { type: GraphQLInt },
      },
      async resolve(parent, { id, piece, row, column }) {
        const chessBoard = await ChessBoardModel.findById(id);
        if (!chessBoard) {
          throw new Error(`Chess board with id ${id} not found`);
        }

        const pieceToUpdate = chessBoard.board.find((p) => p.id === piece);
        if (!pieceToUpdate) {
          throw new Error(`Piece ${piece} not found on chess board ${id}`);
        }

        pieceToUpdate.column = column;
        pieceToUpdate.row = row;
        await chessBoard.save();

        return chessBoard;
      },
    },
    createChessBoard: {
      type: GraphQLID,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, { id }) {
        let chessBoard;
        if (id) {
          chessBoard = await ChessBoardModel.findById(id);
          if (!chessBoard) {
            throw new Error(`Chess board with id ${id} not found`);
          }
        } else {
          const defaultBoard = [
            // White pieces
            { row: 0, column: 0, piece: "rook", color: "white" },
            { row: 0, column: 1, piece: "knight", color: "white" },
            { row: 0, column: 2, piece: "bishop", color: "white" },
            { row: 0, column: 3, piece: "queen", color: "white" },
            { row: 0, column: 4, piece: "king", color: "white" },
            { row: 0, column: 5, piece: "bishop", color: "white" },
            { row: 0, column: 6, piece: "knight", color: "white" },
            { row: 0, column: 7, piece: "rook", color: "white" },
            { row: 1, column: 0, piece: "pawn", color: "white" },
            { row: 1, column: 1, piece: "pawn", color: "white" },
            { row: 1, column: 2, piece: "pawn", color: "white" },
            { row: 1, column: 3, piece: "pawn", color: "white" },
            { row: 1, column: 4, piece: "pawn", color: "white" },
            { row: 1, column: 5, piece: "pawn", color: "white" },
            { row: 1, column: 6, piece: "pawn", color: "white" },
            { row: 1, column: 7, piece: "pawn", color: "white" },

            // Black pieces
            { row: 7, column: 0, piece: "rook", color: "black" },
            { row: 7, column: 1, piece: "knight", color: "black" },
            { row: 7, column: 2, piece: "bishop", color: "black" },
            { row: 7, column: 3, piece: "queen", color: "black" },
            { row: 7, column: 4, piece: "king", color: "black" },
            { row: 7, column: 5, piece: "bishop", color: "black" },
            { row: 7, column: 6, piece: "knight", color: "black" },
            { row: 7, column: 7, piece: "rook", color: "black" },
            { row: 6, column: 0, piece: "pawn", color: "black" },
            { row: 6, column: 1, piece: "pawn", color: "black" },
            { row: 6, column: 2, piece: "pawn", color: "black" },
            { row: 6, column: 3, piece: "pawn", color: "black" },
            { row: 6, column: 4, piece: "pawn", color: "black" },
            { row: 6, column: 5, piece: "pawn", color: "black" },
            { row: 6, column: 6, piece: "pawn", color: "black" },
            { row: 6, column: 7, piece: "pawn", color: "black" },
          ];

          const newBoard = new ChessBoardModel({ board: defaultBoard });
          await newBoard.save();
          return newBoard.id;
        }

        const newBoard = new ChessBoardModel({ board: chessBoard.board });
        newBoard._id = mongoose.Types.ObjectId();
        newBoard.isNew = true;
        await newBoard.save();

        return newBoard.id;
      },
    },
    deleteChessBoard: {
      type: GraphQLID,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, { id }) {
        const result = await ChessBoardModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          throw new Error(`Chess board with id ${id} not found`);
        }
        return id;
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    chessBoard: {
      _id: GraphQLID,
      type: ChessBoardType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return ChessBoardModel.findById(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
