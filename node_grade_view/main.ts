// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";
import { jwtVerify } from "npm:jose";
import cors from "npm:cors";

import db from "./db.ts"
await db.connect();

import User from "./model/User.ts";
import Grade from "./model/Grade.ts";

const app = express();

app.use(cors({
    origin: Deno.env.get("CORS_ORIGIN"),
    methods: ["GET"],
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

app.get("/grades", async (req, res) => {
    // @ts-ignore: For getting role from the previous middleware
    const { userId, role } = req;
    if (role !== "student") return res.status(403).json({ message: "Forbidden for this role" });

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const grades = await Grade.find({ student: user }).populate("course").exec();
    if (!grades) return res.status(404).json({ message: "Grades not found" });
    
    return res.status(200).json({
        grades: grades.map(grade => ({
            // @ts-ignore: For getting course code from the populated course
            course: grade.course.code,
            grade: grade.grade
        }))
    });
});

app.listen(8043);
console.log(`[grade_view @ 8043] Server is running on http://localhost:8043`);
