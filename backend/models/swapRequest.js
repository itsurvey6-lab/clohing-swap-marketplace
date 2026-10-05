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


    // =========================================
    // SWAP STATUS
    // =========================================

    status: {
        type: String,

        enum: [
            "pending",
            "accepted",
            "rejected",
            "cancelled",
            "completed"
        ],

        default: "pending"
    },


    // =========================================
    // DELIVERY METHOD
    // =========================================

    deliveryMethod: {

        type: String,

        enum: [
            "local",
            "courier"
        ],

        default: "local"

    },


    // =========================================
    // COURIER STATUS
    // =========================================

    courierStatus: {

        type: String,

        enum: [
            "not_required",
            "pending",
            "pickup_scheduled",
            "picked_up",
            "in_transit",
            "delivered",
            "completed"
        ],

        default: "not_required"

    },


    // =========================================
    // SENDER ADDRESS
    // =========================================

    senderAddress: {

        type: String,

        default: ""

    },


    // =========================================
    // RECEIVER ADDRESS
    // =========================================

    receiverAddress: {

        type: String,

        default: ""

    },


    // =========================================
    // COURIER INFORMATION
    // =========================================

    courierName: {

        type: String,

        default: ""

    },


    trackingNumber: {

        type: String,

        default: ""

    }

}, {

    timestamps: true

});


export default mongoose.model(
    "SwapRequest",
    swapRequestSchema
);