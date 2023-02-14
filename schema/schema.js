const graphql = require("graphql");
const mongoose = require("mongoose");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const ChessBoardSchema = new mongoose.Schema({
  board: [
    {
      location: String,
      piece: String,
    },
  ],
});

const ChessBoardModel = mongoose.model("ChessBoards", ChessBoardSchema);

const PieceType = new GraphQLObjectType({
  name: "Piece",
  fields: () => ({
    location: { type: GraphQLString },
    piece: { type: GraphQLString },
  }),
});

const ChessBoardType = new GraphQLObjectType({
  name: "ChessBoard",
  fields: () => ({
    board: { type: new GraphQLList(PieceType) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    chessBoard: {
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
});
