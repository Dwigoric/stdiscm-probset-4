// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";

import db from "./db.ts"
import { jwtVerify } from "npm:jose";
await db.connect();

import User from "./model/User.ts";
import Course from "./model/Course.ts";

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

app.post("/enroll/:course", async (req, res) => {
    // @ts-ignore: For accessing userId and role
    const { userId, role } = req;
    if (role !== "student") return res.status(403).send("Forbidden");
   
    const user = await User.findOne({ userId }).populate("courses").exec();
    if (!user) return res.status(404).send("User not found");
    const courseCode = req.params.course;

    const course = await Course.findOne({ code: courseCode });
    if (!course) return res.status(404).send("Course not found");

    // @ts-ignore: For populating courses
    if (user.courses.includes(course._id)) {
        return res.status(400).send("Already enrolled in this course");
    }
    
    user.courses.push(course._id);
    await user.save();
    
    return res.status(200).send("Enrolled successfully");
});

app.listen(8042);
console.log(`Server is running on http://localhost:8042`);
