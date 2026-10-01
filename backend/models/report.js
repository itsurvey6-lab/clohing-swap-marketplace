import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    },

    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "reviewed", "resolved"],
        default: "pending"
    }

});

export default mongoose.model("Report", reportSchema);