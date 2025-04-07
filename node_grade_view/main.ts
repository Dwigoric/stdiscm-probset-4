// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";

import db from "./db.ts"
import { jwtVerify } from "npm:jose";
await db.connect();

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401);

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401);

    try {
        const secret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"));
        const verifyResult = await jwtVerify(token, secret);
        if (!verifyResult) return res.status(401);
        const payload = verifyResult.payload;
        const userId = payload.userId;
        const role = payload.role;
        if (!userId) return res.status(401);
        if (!role) return res.status(401);

        // @ts-ignore: For passing userId to the next middleware
        req.userId = userId;
        // @ts-ignore: For passing role to the next middleware
        req.role = role;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403);
    }
});

app.get("/", (_req, res) => {
    res.send("Welcome to the Dinosaur API!");
});

app.listen(8043);
console.log(`Server is running on http://localhost:8043`);
