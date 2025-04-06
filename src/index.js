import mongoose from "mongoose";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { typeDefs } from "./grapql/typeDefs.js";
import { resolvers } from "./grapql/resolvers/subcribtion.resolver.js";
import { ApolloServer } from "apollo-server-express";
import { getUserFromToken } from "./utils/getUserFromToken.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("server running on port ", process.env.PORT);
    });
  })
  .catch(() => {
    console.log("mongo db connection failed");
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const user = await getUserFromToken(token);

    console.log(user, "app");
    return { user };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(
      `🚀 Server running at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startServer();

// run().catch(console.dir);
