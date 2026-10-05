import SwapRequest from "../models/swapRequest.js";
import Listing from "../models/listing.js";


// =====================================================
// CREATE SWAP REQUEST
// =====================================================

const createSwapRequest = async (req, res) => {

    try {

        const listing =
            await Listing.findById(
                req.body.listing
            );


        const offeredListing =
            await Listing.findById(
                req.body.offeredListing
            );


        if (!listing || !offeredListing) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        if (
            listing.status !== "available" ||
            offeredListing.status !== "available"
        ) {

            return res.status(400).send(
                "Both listings must be available"
            );

        }


        if (
            req.body.listing ===
            req.body.offeredListing
        ) {

            return res.status(400).send(
                "You cannot offer the same listing"
            );

        }


        if (
            listing.owner.toString() ===
            req.user.userId
        ) {

            return res.status(400).send(
                "You cannot request your own listing"
            );

        }


        // CHECK DUPLICATE REQUEST

        const existingRequest =
            await SwapRequest.findOne({

                requester:
                    req.user.userId,

                listing:
                    req.body.listing,

                offeredListing:
                    req.body.offeredListing,

                status: "pending"

            });


        if (existingRequest) {

            return res.status(400).send(
                "You already have a pending request for this item"
            );

        }


        const swapRequest =
            new SwapRequest({

                requester:
                    req.user.userId,

                listing:
                    req.body.listing,

                offeredListing:
                    req.body.offeredListing

            });


        await swapRequest.save();


        res.send(
            "Swap request created successfully"
        );


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Server error"
        );

    }

};


// =====================================================
// GET MY SWAP REQUESTS
// =====================================================

const getMySwapRequests = async (req, res) => {

    try {

        const requests =
            await SwapRequest.find({

                requester:
                    req.user.userId

            })

            .populate(
                "requester",
                "-password"
            )

            .populate("listing")

            .populate("offeredListing");


        res.json(requests);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Server error"
        );

    }

};


// =====================================================
// GET INCOMING SWAP REQUESTS
// =====================================================

const getIncomingSwapRequests = async (req, res) => {

    try {

        // Find listings owned by logged-in user

        const listings =
            await Listing.find({

                owner:
                    req.user.userId

            }).select("_id");


        const listingIds =
            listings.map(
                (item) => item._id
            );


        const requests =
            await SwapRequest.find({

                listing: {
                    $in: listingIds
                }

            })

            .populate(
                "requester",
                "-password"
            )

            .populate("listing")

            .populate("offeredListing");


        res.json(requests);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Server error"
        );

    }

};


// =====================================================
// UPDATE SWAP REQUEST
// ACCEPT / REJECT / CANCEL
// =====================================================

const updateSwapRequest = async (req, res) => {

    try {

        const request =
            await SwapRequest.findById(
                req.params.id
            )

            .populate(
                "requester",
                "-password"
            )

            .populate("listing")

            .populate("offeredListing");


        if (!request) {

            return res.status(404).send(
                "Swap request not found"
            );

        }


        if (
            request.status !== "pending"
        ) {

            return res.status(400).send(
                "This swap request can no longer be updated"
            );

        }


        const allowedStatuses = [

            "accepted",

            "rejected",

            "cancelled"

        ];


        if (
            !allowedStatuses.includes(
                req.body.status
            )
        ) {

            return res.status(400).send(
                "Invalid swap request status"
            );

        }


        // CANCEL

        if (
            req.body.status === "cancelled"
        ) {

            if (
                request.requester._id.toString()
                !== req.user.userId
            ) {

                return res.status(403).send(
                    "Only the requester can cancel this request"
                );

            }

        }

        // ACCEPT / REJECT

        else {

            if (
                request.listing.owner.toString()
                !== req.user.userId
            ) {

                return res.status(403).send(
                    "Only the listing owner can update this request"
                );

            }

        }


        request.status =
            req.body.status;


        // =========================================
        // ACCEPTED SWAP
        // =========================================

        if (
            req.body.status === "accepted"
        ) {

            await Listing.findByIdAndUpdate(

                request.listing._id,

                {
                    status: "swapped"
                }

            );


            await Listing.findByIdAndUpdate(

                request.offeredListing._id,

                {
                    status: "swapped"
                }

            );


            // Default courier state

            request.courierStatus =
                "pending";

        }


        await request.save();


        res.json(request);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Server error"
        );

    }

};


// =====================================================
// START COURIER DELIVERY
// =====================================================

const startCourierDelivery = async (req, res) => {

    try {

        const request =
            await SwapRequest.findById(
                req.params.id
            );


        if (!request) {

            return res.status(404).send(
                "Swap request not found"
            );

        }


        // Only accepted swaps can use courier

        if (
            request.status !== "accepted"
        ) {

            return res.status(400).send(
                "Courier delivery can only be started for an accepted swap"
            );

        }


        // User must belong to the swap

        const requesterId =
            request.requester.toString();


        const listing =
            await Listing.findById(
                request.listing
            );


        if (!listing) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        const ownerId =
            listing.owner.toString();


        if (
            req.user.userId !== requesterId &&
            req.user.userId !== ownerId
        ) {

            return res.status(403).send(
                "You are not part of this swap"
            );

        }


        const {
            deliveryMethod,
            senderAddress,
            receiverAddress
        } = req.body;


        if (
            !deliveryMethod
        ) {

            return res.status(400).send(
                "Delivery method is required"
            );

        }


        if (
            deliveryMethod === "courier"
        ) {

            if (
                !senderAddress ||
                !receiverAddress
            ) {

                return res.status(400).send(
                    "Sender and receiver addresses are required for courier delivery"
                );

            }


            request.deliveryMethod =
                "courier";


            request.senderAddress =
                senderAddress;


            request.receiverAddress =
                receiverAddress;


            request.courierStatus =
                "pending";

        }

        else {

            request.deliveryMethod =
                "local";


            request.courierStatus =
                "not_required";

        }


        await request.save();


        res.json(request);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to start courier delivery"
        );

    }

};


// =====================================================
// UPDATE COURIER STATUS
// =====================================================

const updateCourierStatus = async (req, res) => {

    try {

        const request =
            await SwapRequest.findById(
                req.params.id
            );


        if (!request) {

            return res.status(404).send(
                "Swap request not found"
            );

        }


        if (
            request.status !== "accepted"
        ) {

            return res.status(400).send(
                "Swap must be accepted first"
            );

        }


        const listing =
            await Listing.findById(
                request.listing
            );


        if (!listing) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        const requesterId =
            request.requester.toString();


        const ownerId =
            listing.owner.toString();


        // Only people involved in the swap

        if (
            req.user.userId !== requesterId &&
            req.user.userId !== ownerId
        ) {

            return res.status(403).send(
                "You are not part of this swap"
            );

        }


        const allowedStatuses = [

            "pending",

            "pickup_scheduled",

            "picked_up",

            "in_transit",

            "delivered",

            "completed"

        ];


        const newStatus =
            req.body.courierStatus;


        if (
            !allowedStatuses.includes(
                newStatus
            )
        ) {

            return res.status(400).send(
                "Invalid courier status"
            );

        }


        request.courierStatus =
            newStatus;


        // When courier delivery is completed,
        // mark the swap as completed.

        if (
            newStatus === "completed"
        ) {

            request.status =
                "completed";

        }


        await request.save();


        res.json(request);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to update courier status"
        );

    }

};


// =====================================================
// ADD COURIER INFORMATION
// =====================================================

const updateCourierInformation = async (req, res) => {

    try {

        const request =
            await SwapRequest.findById(
                req.params.id
            );


        if (!request) {

            return res.status(404).send(
                "Swap request not found"
            );

        }


        if (
            request.status !== "accepted"
        ) {

            return res.status(400).send(
                "Swap must be accepted first"
            );

        }


        const listing =
            await Listing.findById(
                request.listing
            );


        if (!listing) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        const requesterId =
            request.requester.toString();


        const ownerId =
            listing.owner.toString();


        if (
            req.user.userId !== requesterId &&
            req.user.userId !== ownerId
        ) {

            return res.status(403).send(
                "You are not part of this swap"
            );

        }


        const {
            courierName,
            trackingNumber
        } = req.body;


        if (courierName !== undefined) {

            request.courierName =
                courierName;

        }


        if (
            trackingNumber !== undefined
        ) {

            request.trackingNumber =
                trackingNumber;

        }


        await request.save();


        res.json(request);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to update courier information"
        );

    }

};


export {

    createSwapRequest,

    getMySwapRequests,

    getIncomingSwapRequests,

    updateSwapRequest,

    startCourierDelivery,

    updateCourierStatus,

    updateCourierInformation

};