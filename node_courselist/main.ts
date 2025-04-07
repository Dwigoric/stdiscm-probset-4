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

app.get("/courselist", async (_req, res) => {
    const courseList = await Course.find();
    if (!courseList) return res.status(404);
    return res.status(200).json(courseList.map((course) => course.code));
});

app.listen(8041);
console.log(`Server is running on http://localhost:8041`);
