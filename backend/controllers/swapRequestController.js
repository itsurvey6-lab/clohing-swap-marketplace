import SwapRequest  from "../models/swapRequest.js";
import Listing from "../models/listing.js";


const createSwapRequest = async (req, res) => {

    const listing = await Listing.findById(req.body.listing);

    const offeredListing = await Listing.findById(req.body.offeredListing);

    if (!listing || !offeredListing) {
        return res.status(404).send("Listing not found");
    }

    if (listing.status !== "available" || offeredListing.status !== "available") {
        return res.status(400).send("Both listings must be available");
    }

    if (req.body.listing === req.body.offeredListing) {
    return res.status(400).send("You cannot offer the same listing");
    }

    if (listing.owner.toString() === req.user.userId) {
        return res.status(400).send("You cannot request your own listing");
    }


    // CHECK FOR DUPLICATE REQUEST
    const existingRequest = await SwapRequest.findOne({
        requester: req.user.userId,
        listing: req.body.listing,
        offeredListing: req.body.offeredListing,
        status: "pending"
    });

    if (existingRequest) {
        return res.status(400).send("You already have a pending request for this item");
    }

    const swapRequest = new SwapRequest({
        requester: req.user.userId,
        listing: req.body.listing,
        offeredListing: req.body.offeredListing
    });

    await swapRequest.save();
    res.send("Swap request created successfully");
};



/////////////////////

const getMySwapRequests = async (req, res) => {

    try {

        const requests = await SwapRequest.find({
            requester: req.user.userId
        })
        .populate("requester", "-password")
        .populate("listing")
        .populate("offeredListing");

        res.json(requests);

    } catch (error) {

        console.log(error);

        res.status(500).send("Server error");

    }
};

//////////////////////

const getIncomingSwapRequests = async (req, res) => {

    try {

        // Find all listings owned by the logged-in user
        const listings = await Listing.find({
            owner: req.user.userId
        }).select("_id");

        // Get only the listing IDs
        const listingIds = listings.map((item) => item._id);

        // Find swap requests targeting those listings
        const requests = await SwapRequest.find({
            listing: { $in: listingIds }
        })
        .populate("requester", "-password")
        .populate("listing")
        .populate("offeredListing");

        res.json(requests);

    } catch (error) {

        console.log(error);

        res.status(500).send("Server error");

    }

};




////////////////

const updateSwapRequest = async (req, res) => {

    const request = await SwapRequest.findById(req.params.id)
        .populate("requester", "-password")
        .populate("listing")
        .populate("offeredListing");

    if (!request) {
        return res.status(404).send("Swap request not found");
    }


    if (request.status !== "pending") {
    return res.status(400).send("This swap request can no longer be updated");
    }

    const allowedStatuses = [
        "accepted",
        "rejected",
        "cancelled"
    ];

    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).send("Invalid swap request status");
    }
    if (req.body.status === "cancelled") {

        if (request.requester.toString() !== req.user.userId) {
            return res.status(403).send("Only the requester can cancel this request");
        }

    } else {

        if (request.listing.owner.toString() !== req.user.userId) {
            return res.status(403).send("Only the listing owner can update this request");
        }

    }

    request.status = req.body.status;

    if (req.body.status === "accepted") {

    await Listing.findByIdAndUpdate(
        request.listing._id,
        { status: "swapped" }
    );

    await Listing.findByIdAndUpdate(
        request.offeredListing,
        { status: "swapped" }
    );
    }
    await request.save();

    res.json(request);
};



export {
    createSwapRequest,
    getMySwapRequests,
    getIncomingSwapRequests,
    updateSwapRequest
};