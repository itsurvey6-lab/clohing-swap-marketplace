import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        brand: {
            type: String,
            required: true
        },

        size: {
            type: String,
            required: true
        },

        condition: {
            type: String,
            required: true
        },

        swapValue: {
            type: Number,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: "available"
        },

        // Main image
        image: {
            type: String
        },

        // All images
        images: {
            type: [String],
            default: []
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
);

export default mongoose.model("Listing", listingSchema);