import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    createReview,
    getUserReviews,
    getMyReviewForSwap
} from "../controllers/reviewController.js";


const router = express.Router();


// =====================================================
// CREATE REVIEW
// =====================================================

router.post(
    "/",
    authMiddleware,
    createReview
);


// =====================================================
// GET REVIEWS FOR USER
// =====================================================

router.get(
    "/user/:userId",
    getUserReviews
);


// =====================================================
// CHECK CURRENT USER REVIEW
// =====================================================

router.get(
    "/swap/:swapRequestId",
    authMiddleware,
    getMyReviewForSwap
);


export default router;