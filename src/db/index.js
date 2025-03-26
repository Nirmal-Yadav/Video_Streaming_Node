import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { MongoClient, ServerApiVersion } from "mongodb";

console.log("process.env.MONGO_URI0", process.env.MONGO_URI);

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );

    console.log(`\n mongo db connected`);
  } catch (error) {
    console.log("MONGO db connection error");
    process.exit(1);
  }
}

///////////////  below second method tho connect db

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}

// export default run;
export default connectDB;
