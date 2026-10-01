import mongoose from "mongoose"
import { FaDeaf } from "react-icons/fa";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        uniique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

});


export default mongoose.model("User", userSchema);