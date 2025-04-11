// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";
import { jwtVerify } from "npm:jose";
import cors from "npm:cors";

import db from "./db.ts"
await db.connect();

import Course from "./model/Course.ts"

const app = express();

app.use(cors({
    origin: Deno.env.get("CORS_ORIGIN"),
    methods: ["GET", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());

app.use(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const secret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"));
        const verifyResult = await jwtVerify(token, secret);
        if (!verifyResult) return res.status(401).json({ message: "Invalid token" });
        const { userId, role } = verifyResult.payload;
        if (!userId) return res.status(401).json({ message: "Invalid token" });
        if (!role) return res.status(401).json({ message: "Invalid token" });

        // @ts-ignore: For passing userId to the next middleware
        req.userId = userId;
        // @ts-ignore: For passing role to the next middleware
        req.role = role;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
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
        return res.status(500).json({ message: "Failed to fetch courses." });
    }
});

app.put("/create_course", async (req, res) => {
    // @ts-ignore: For passing role from the previous middleware
    if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: "Course code is required." });
        
        const existingCourse = await Course.findOne({ code });
        if (existingCourse) return res.status(409).json({ message: "Course already exists." });

        const course = new Course({ code });
        await course.save();

        return res.status(201).json({ message: "Course created successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create course." });
    }
})

app.listen(8041);
console.log(`[courselist @ 8041] Server is running on http://localhost:8041`);
