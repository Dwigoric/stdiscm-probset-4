import mongoose from "mongoose"

class Database {
	public connect() {
		if (!Deno.env.has("MONGODB_URI")) throw new Error("MONGODB_URI is not set")
		if (mongoose.connection.readyState) throw new Error("Already connected to MongoDB")

		console.log("Connecting to MongoDB...")
		return mongoose.connect(Deno.env.get("MONGODB_URI") as string)
	}
}

const db = new Database()
export default db
