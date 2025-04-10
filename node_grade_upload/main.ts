// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";
import { jwtVerify } from "npm:jose";
import cors from "npm:cors";

import db from "./db.ts"
await db.connect();

import User from "./model/User.ts";
import Course from "./model/Course.ts";
import Grade from "./model/Grade.ts";

const app = express();

app.use(cors({
    origin: Deno.env.get("CORS_ORIGIN"),
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

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

app.post("/post-grade", async (req, res) => {
    // @ts-ignore: For passing from the next middleware
    const { userId, role } = req;
    const { studentId, grade, courseCode } = req.body;
    if (role !== "faculty") return res.status(403).send("Unauthorized");
    if (!grade || !courseCode || !studentId) return res.status(400).send("Missing at least one of required fields: studentId, grade, course");
    
    if (typeof grade !== "number") {
        return res.status(400).send("Grade must be a number");
    }
    if (grade !== 0 && grade !== 1 && grade !== 1.5 && grade !== 2 && grade !== 2.5 && grade !== 3 && grade !== 3.5 && grade !== 4) {
        return res.status(400).send("Invalid grade");
    }
    
    if (typeof courseCode !== "string") {
        return res.status(400).send("Course code must be a string");
    }
    if (typeof studentId !== "string") {
        return res.status(400).send("Student ID must be a string");
    }
    
    const instructor = await User.findOne({ userId });
    if (!instructor) return res.status(404).send("Instructor not found");
    
    const course = await Course.findOne({ code: courseCode });
    if (!course) return res.status(404).send("Course not found");
    
    if (!instructor.courses.includes(course._id)) return res.status(403).send("Instructor not assigned to this course");
    
    const student = await User.findOne({ userId: studentId });
    if (!student) return res.status(404).send("Student not found");
    if (!student.courses.includes(course._id)) return res.status(400).send("Student not enrolled in this course");
    
    const insertedGrade = await Grade.insertOne({
        student,
        course,
        grade,
        instructor
    })
    
    if (!insertedGrade) return res.status(500).send("Failed to insert grade");
    return res.status(201).send("Grade posted successfully");
});

app.listen(8044);
console.log(`[grade_upload @ 8044] Server is running on http://localhost:8044`);
