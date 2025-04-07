import { model, Schema } from "mongoose"

import Course from "./Course.ts";

const userSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	role: {
		type: String,
		enum: ["faculty", "student"],
	},
	courses: {
		type: [Schema.Types.ObjectId],
		ref: Course,
		default: [],
	}
}, {
	timestamps: true,
})

export default model("User", userSchema)
