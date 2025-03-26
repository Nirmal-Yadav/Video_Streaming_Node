import mongoose from "mongoose";
import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import run from "./db/index.js";

const app = express();

dotenv.config({
  path: "./env",
});

connectDB();
// run().catch(console.dir);
