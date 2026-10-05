import Review from "../models/review.js";
import SwapRequest from "../models/swapRequest.js";
import User from "../models/user.js";


// =====================================================
// CREATE REVIEW
// =====================================================

const createReview = async (req, res) => {

    try {

        const {
            swapRequest,
            reviewedUser,
            rating,
            comment
        } = req.body;


        // ---------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !swapRequest ||
            !reviewedUser ||
            rating === undefined
        ) {

            return res.status(400).send(
                "Swap request, reviewed user and rating are required"
            );

        }


        // ---------------------------------------------
        // VALIDATE RATING
        // ---------------------------------------------

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {

            return res.status(400).send(
                "Rating must be a whole number between 1 and 5"
            );

        }


        // ---------------------------------------------
        // FIND SWAP REQUEST
        // ---------------------------------------------

        const request = await SwapRequest.findById(
            swapRequest
        );

        if (!request) {

            return res.status(404).send(
                "Swap request not found"
            );

        }


        // ---------------------------------------------
        // SWAP MUST BE COMPLETED
        // ---------------------------------------------

        if (request.status !== "completed") {

            return res.status(400).send(
                "You can only review a completed swap"
            );

        }


        // ---------------------------------------------
        // CHECK USER IS PART OF THE SWAP
        // ---------------------------------------------

        const reviewerId = req.user.userId;

        const requesterId =
            request.requester.toString();

        const requestedListing =
            await SwapRequest.findById(request._id)
                .populate({
                    path: "listing",
                    select: "owner"
                });


        if (!requestedListing || !requestedListing.listing) {

            return res.status(404).send(
                "Requested listing not found"
            );

        }


        const listingOwnerId =
            requestedListing.listing.owner.toString();


        if (
            reviewerId !== requesterId &&
            reviewerId !== listingOwnerId
        ) {

            return res.status(403).send(
                "You are not part of this swap"
            );

        }


        // ---------------------------------------------
        // REVIEWER CANNOT REVIEW THEMSELVES
        // ---------------------------------------------

        if (reviewerId === reviewedUser) {

            return res.status(400).send(
                "You cannot review yourself"
            );

        }


        // ---------------------------------------------
        // CHECK REVIEWED USER EXISTS
        // ---------------------------------------------

        const user = await User.findById(
            reviewedUser
        );

        if (!user) {

            return res.status(404).send(
                "Reviewed user not found"
            );

        }


        // ---------------------------------------------
        // CHECK REVIEWED USER IS THE OTHER PERSON
        // ---------------------------------------------

        const otherUser =
            reviewerId === requesterId
                ? listingOwnerId
                : requesterId;


        if (reviewedUser !== otherUser) {

            return res.status(403).send(
                "You can only review the other person in this swap"
            );

        }


        // ---------------------------------------------
        // PREVENT DUPLICATE REVIEW
        // ---------------------------------------------

        const existingReview = await Review.findOne({
            reviewer: reviewerId,
            reviewedUser,
            swapRequest
        });

        if (existingReview) {

            return res.status(400).send(
                "You have already reviewed this swap"
            );

        }


        // ---------------------------------------------
        // CREATE REVIEW
        // ---------------------------------------------

        const review = new Review({

            reviewer: reviewerId,

            reviewedUser,

            swapRequest,

            rating: numericRating,

            comment: comment || ""

        });


        await review.save();


        // ---------------------------------------------
        // RETURN REVIEW
        // ---------------------------------------------

        const populatedReview =
            await Review.findById(review._id)
                .populate("reviewer", "-password")
                .populate("reviewedUser", "-password");


        res.status(201).json(
            populatedReview
        );


    } catch (error) {

        console.log(
            "Create review error:",
            error
        );

        res.status(500).send(
            "Unable to create review"
        );

    }

};



// =====================================================
// GET REVIEWS FOR USER
// =====================================================

const getUserReviews = async (req, res) => {

    try {

        const { userId } = req.params;


        // ---------------------------------------------
        // CHECK USER EXISTS
        // ---------------------------------------------

        const user = await User.findById(
            userId
        );

        if (!user) {

            return res.status(404).send(
                "User not found"
            );

        }


        // ---------------------------------------------
        // GET REVIEWS
        // ---------------------------------------------

        const reviews = await Review.find({
            reviewedUser: userId
        })
            .populate(
                "reviewer",
                "-password"
            )
            .sort({
                createdAt: -1
            });


        // ---------------------------------------------
        // CALCULATE AVERAGE
        // ---------------------------------------------

        const totalReviews =
            reviews.length;


        const averageRating =
            totalReviews > 0
                ? (
                    reviews.reduce(
                        (sum, review) =>
                            sum + review.rating,
                        0
                    ) / totalReviews
                ).toFixed(1)
                : 0;


        res.json({

            userId,

            totalReviews,

            averageRating: Number(
                averageRating
            ),

            reviews

        });


    } catch (error) {

        console.log(
            "Get user reviews error:",
            error
        );

        res.status(500).send(
            "Unable to get reviews"
        );

    }

};



// =====================================================
// CHECK IF CURRENT USER REVIEWED A SWAP
// =====================================================

const getMyReviewForSwap = async (req, res) => {

    try {

        const { swapRequestId } =
            req.params;


        const review = await Review.findOne({

            reviewer: req.user.userId,

            swapRequest: swapRequestId

        })
            .populate(
                "reviewedUser",
                "-password"
            );


        if (!review) {

            return res.json({
                reviewed: false
            });

        }


        res.json({

            reviewed: true,

            review

        });


    } catch (error) {

        console.log(
            "Check review error:",
            error
        );

        res.status(500).send(
            "Unable to check review"
        );

    }

};


export {
    createReview,
    getUserReviews,
    getMyReviewForSwap
};