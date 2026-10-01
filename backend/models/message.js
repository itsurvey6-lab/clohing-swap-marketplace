import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    swapRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SwapRequest",
        required: true
    },

    message: {
        type: String,
        required: true
    }

});

export default mongoose.model("Message", messageSchema);