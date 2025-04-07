import mongoose from "mongoose"

class Database {
	private db: mongoose.Connection

	constructor() {
		this.db = mongoose.createConnection(Deno.env.get("MONGODB_URI") as string)
	}

	public connect() {
		this.db.on("error", console.error.bind(console, "MongoDB connection error:"))
		this.db.once("open", () => {
			console.log("Connected to MongoDB")
		})
	}
}

const db = new Database()
export default db
