// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";

import db from "./db.ts"
await db.connect();

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(8043);
console.log(`Server is running on http://localhost:8043`);
