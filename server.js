const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
// eslint-disable-next-line
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

const app = express();

// app.use("/graphql", (req, res, next) => {
//   console.log(req.body);
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })(req, res, next);
// });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
