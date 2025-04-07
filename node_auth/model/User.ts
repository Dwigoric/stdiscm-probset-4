import { model, Schema } from "mongoose"

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
}, {
	timestamps: true,
})

export default model("User", userSchema)
