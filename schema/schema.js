const graphql = require("graphql");
const Chess = require("../models/chess");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data

const ChessType = new GraphQLObjectType({
  name: "chessType",
  //We are wrapping fields in the function as we dont want to execute this ultil
  //everything is initalized. For example below code will throw error chessType not
  //found if not wrapped in a function
  fields: () => ({
    test: { type: GraphQLString },
    // board: { type: new GraphQLList(GraphQLString) },
  }),
});

//RootQuery describe how users can use the graph and grab data.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    chess: {
      type: ChessType,
      //argument passed by the user while making the query
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Here we define how to get data from database source

        //this will return the chess board with id passed in argument
        //by the user
        return Chess.findById(args.id).then((chess) => {
          return { test: chess.test };
        });
      },
    },
  },
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
  query: RootQuery,
});
