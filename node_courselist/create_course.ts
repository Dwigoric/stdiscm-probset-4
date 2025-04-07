import "jsr:@std/dotenv/load"

import db from "./db.ts";
import Course from "./model/Course.ts";

await db.connect();
const args = Deno.args;
if (args.length < 1) {
    console.error("Usage: deno run --allow-net --allow-env --allow-read --allow-sys create_course.ts <course_code>");
    Deno.exit(1);
}
const [code] = args;
const existingCourse = await Course.findOne({ code });
if (existingCourse) {
    console.error("Course already exists");
    Deno.exit(1);
}
const course = new Course({ code });
await course.save();

console.log("Course created successfully");
