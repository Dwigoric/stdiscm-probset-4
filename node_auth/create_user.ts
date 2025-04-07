import "jsr:@std/dotenv/load"
import { hash } from "npm:argon2";

import db from "./db.ts";
import User from "./model/User.ts";

await db.connect();
const args = Deno.args;
if (args.length < 3) {
    console.error("Usage: deno run --allow-net --allow-env --allow-read --allow-sys --allow-write --allow-ffi create_user.ts <username> <password> <role>");
    Deno.exit(1);
}
const [username, password, role] = args;
if (!["faculty", "student"].includes(role)) {
    console.error("Role must be either 'faculty' or 'student'");
    Deno.exit(1);
}
const existingUser = await User.findOne({ userId: username });
if (existingUser) {
    console.error("User already exists");
    Deno.exit(1);
}
const hashedPassword = await hash(password);
const user = new User({
    userId: username,
    password: hashedPassword,
    role,
});
await user.save();

console.log("User created successfully");
