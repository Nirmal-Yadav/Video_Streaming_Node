import mongoose from "mongoose";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

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
    console.log("momgo db connection failed");
  });

// run().catch(console.dir);
