// @ts-types="npm:@types/express@4.17.15"

import express from "npm:express"
import "jsr:@std/dotenv/load"
import { jwtVerify, SignJWT } from "npm:jose";
import { verify, hash } from "npm:argon2";
import cors from "npm:cors";

import db from "./db.ts"
await db.connect();

import User from "./model/User.ts"

const app = express();

app.use(cors({
    origin: Deno.env.get("CORS_ORIGIN"),
    methods: ["POST", "PUT"],
    allowedHeaders: ["Content-Type"],
}))

app.use(express.json());

app.post("/login", async (req, res) => {
    const { userId, password } = req.body;
    
    const user = await User.findOne({ userId });
    if (!user) {
        return res.status(401).send("Invalid credentials");
    }
    const isValid = await verify(user.password, password);
    if (!isValid) {
        return res.status(401).send("Invalid credentials");
    }
    
    const token = await new SignJWT({ userId, role: user.role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(Deno.env.get("JWT_SECRET")));
    
    return res.status(200).json({ token });
});

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

app.put("/create_user", async (req, res) => {
    // @ts-ignore: For passing role from the previous middleware
    if (req.role !== "admin") return res.status(403).send({ message: "Forbidden" });
    
    const { userId, password, role } = req.body;
    
    if (!["faculty", "student"].includes(role)) {
        return res.status(400).send("Role must be either 'faculty' or 'student'");
    }
    
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
        return res.status(409).send("User already exists");
    }
    
    const hashedPassword = await hash(password);
    const user = new User({
        userId,
        password: hashedPassword,
        role,
    });
    
    await user.save();
    
    return res.status(201).send("User created successfully");
})

app.listen(8040);
console.log(`[auth @ 8040] Server is running on http://localhost:8040`);
