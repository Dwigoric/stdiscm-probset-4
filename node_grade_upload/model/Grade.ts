import { model, Schema } from "mongoose";
import User from "./User.ts";
import Course from "./Course.ts";

const gradeSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: Course,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    }
}, {
    timestamps: true,
})

export default model("Grade", gradeSchema);
