import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    swapRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Review",
  reviewSchema
);