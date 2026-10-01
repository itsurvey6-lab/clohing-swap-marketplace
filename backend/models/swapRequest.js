import mongoose from "mongoose";


const swapRequestSchema = new mongoose.Schema({

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    offeredListing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
        default: "pending"
    }
})


export default mongoose.model("SwapRequest", swapRequestSchema)
