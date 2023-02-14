const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const { buildSchema } = require("graphql");
require("dotenv").config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define your GraphQL schema
const schema = buildSchema(`
  type Query {
  board: [Piece]
  piece(location: String!): Piece
  test: String
}

type Piece {
  piece: String
  location: String
}
`);

// Define your Mongoose model
const Piece = mongoose.model("Piece", {
  piece: String,
  location: String,
});

// Define your GraphQL resolvers
const rootValue = {
  board: () => Piece.find().lean().exec(),
  piece: ({ location }) => {
    return new Promise((resolve, reject) => {
      Piece.findOne({ location })
        .lean()
        .exec((err, piece) => {
          if (err) {
            reject(err);
          } else {
            resolve(piece);
          }
        });
    });
  },
  test: () => "test",
};
const app = express();

// Use express-graphql middleware to handle GraphQL requests
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
