import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
});

export default model("Course", courseSchema);
