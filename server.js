require("dotenv").config(); // Load environment variables

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }), // Pass request to context for authentication
});

// Apply Apollo Middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("✅ MongoDB Connected");
      app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}${server.graphqlPath}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
}

// Start the server
startServer();
