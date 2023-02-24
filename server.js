const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const isTokenValid = require('./validate');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('connection error:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('connected to database');
});

// Create a context for holding contextual data
const context = async (req) => {
  const { authorization: token } = req.headers;
  try {
    const decodedToken = await isTokenValid(token);
    return { userId: decodedToken.sub };
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP(async (req) => ({
    schema,
    graphiql: true,
    context: await context(req),
  })),
);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
