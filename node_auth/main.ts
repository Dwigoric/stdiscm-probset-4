// @ts-types="npm:@types/express@4.17.15"

import express from "npm:express"
import "jsr:@std/dotenv/load"
import { SignJWT } from "npm:jose"
import { verify } from "npm:argon2";

import db from "./db.ts"
await db.connect();

import User from "./model/User.ts"

const app = express();

app.use(express.json());

app.post("/login", async (req, res) => {
    const { userId, password } = req.body;
    
    const user = await User.findOne({ userId });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValid = await verify(user.password, password);
    if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(Deno.env.get("JWT_SECRET")));
    
    return res.status(200).json({ token });
});

app.listen(8040);
console.log(`Server is running on http://localhost:8040`);
