// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";
import { jwtVerify } from "npm:jose";

import db from "./db.ts"
await db.connect();

import Course from "./model/Course.ts"

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).send("No token provided");

    try {
        const secret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"));
        const verifyResult = await jwtVerify(token, secret);
        if (!verifyResult) return res.status(401).send("Invalid token");
        const { userId, role } = verifyResult.payload;
        if (!userId) return res.status(401).send("Invalid token");
        if (!role) return res.status(401).send("Invalid token");

        // @ts-ignore: For passing userId to the next middleware
        req.userId = userId;
        // @ts-ignore: For passing role to the next middleware
        req.role = role;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send("Invalid token");
    }
});

app.get("/courselist", async (_req, res) => {
    try {
        const courseList = await Course.find();
        if (!courseList || courseList.length === 0) return res.status(404).json({ message: "No courses available." });

        return res.status(200).json(courseList.map((course) => ({
            code: course.code,
        })));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch courses.' });
    }
});


app.listen(8041);
console.log(`[courselist @ 8041] Server is running on http://localhost:8041`);
