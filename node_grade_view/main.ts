// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import "jsr:@std/dotenv/load";

import db from "./db.ts"
import { jwtVerify } from "npm:jose";
await db.connect();

import User from "./model/User.ts";
import Grade from "./model/Grade.ts";

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

app.get("/grades", async (req, res) => {
    // @ts-ignore: For getting role from the previous middleware
    const { userId, role } = req;
    if (role !== "student") return res.status(403).send("Forbidden for this role");

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).send("User not found");
    const grades = await Grade.find({ student: user }).populate("course").exec();
    if (!grades) return res.status(404).send("Grades not found");
    
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
