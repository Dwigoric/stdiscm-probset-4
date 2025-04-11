// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";
import { jwtVerify } from "npm:jose";
import cors from "npm:cors";

import db from "./db.ts"
await db.connect();

import User from "./model/User.ts";
import Course from "./model/Course.ts";

const app = express();

app.use(cors({
    origin: Deno.env.get("CORS_ORIGIN"),
    methods: ["POST"],
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

app.post("/enroll/:course", async (req, res) => {
    // @ts-ignore: For accessing userId and role
    const { userId, role } = req;
    if (role !== "student") return res.status(403).json({ message: "Forbidden" });
   
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const courseCode = req.params.course;
    const course = await Course.findOne({ code: courseCode });
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (user.courses.includes(course._id)) return res.status(403).json({ message: "Already enrolled in this course" });
    
    user.courses.push(course._id);
    await user.save();
    
    return res.status(200).json({ message: "Enrolled successfully" });
});

app.post("/unenroll/:course", async (req, res) => {
    // @ts-ignore: For accessing userId and role
    const { userId, role } = req;
    if (role !== "student") return res.status(403).json({ message: "Forbidden" });
    
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const courseCode = req.params.course;
    const course = await Course.findOne({ code: courseCode });
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!user.courses.includes(course._id)) return res.status(403).json({ message: "Not enrolled in this course" });
    
    user.courses = user.courses.filter((c) => c.toString() !== course._id.toString());
    await user.save();
    
    return res.status(200).json({ message: "Unenrolled successfully" });
});

app.get("/enrolled", async (req, res) => {
    // @ts-ignore
    const { userId, role } = req;
    if (role !== "student") return res.status(403).json({ message: "Forbidden" });

    const user = await User.findOne({ userId }).populate("courses");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.courses);
});


app.listen(8042);
console.log(`[enroll @ 8042] Server is running on http://localhost:8042`);
