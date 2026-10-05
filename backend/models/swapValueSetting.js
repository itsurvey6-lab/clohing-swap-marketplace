import mongoose from "mongoose";

const swapValueSettingSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: [
            "category",
            "brand",
            "condition"
        ],
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    value: {
        type: Number,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});


// Allow same name in different types
// Example:
// category -> Other
// brand -> Other
// condition -> Other
swapValueSettingSchema.index(
    { type: 1, name: 1 },
    { unique: true }
);

export default mongoose.model(
    "SwapValueSetting",
    swapValueSettingSchema
);