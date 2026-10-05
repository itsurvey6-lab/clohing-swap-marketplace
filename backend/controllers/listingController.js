import Listing from "../models/listing.js";
import User from "../models/user.js";
import calculateSwapValue from "../utils/swapValueCalculator.js";

const createListing = async (req, res) => {

    try {

        const {
            category,
            brand,
            condition
        } = req.body;


        // Calculate swap value using database settings
        const swapValue = await calculateSwapValue({
            category,
            brand,
            condition
        });


        const listing = new Listing({

            ...req.body,

            image: req.file
                ? req.file.filename
                : null,

            owner: req.user.userId,

            swapValue

        });


        await listing.save();

        res.status(201).json(listing);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to create listing"
        );

    }

};


const getItems = async (req, res) => {

    try {

        const filter = {};


        if (req.query.category) {
            filter.category = req.query.category;
        }


        if (req.query.brand) {
            filter.brand = req.query.brand;
        }


        if (req.query.size) {
            filter.size = req.query.size;
        }


        if (req.query.location) {
            filter.location = req.query.location;
        }


        if (req.query.condition) {
            filter.condition = req.query.condition;
        }


        if (req.query.status) {
            filter.status = req.query.status;
        }


        if (req.query.minValue || req.query.maxValue) {

            filter.swapValue = {};


            if (req.query.minValue) {

                filter.swapValue.$gte =
                    Number(req.query.minValue);

            }


            if (req.query.maxValue) {

                filter.swapValue.$lte =
                    Number(req.query.maxValue);

            }

        }


        let query = Listing.find(filter);


        if (req.query.sort === "low") {

            query = query.sort({
                swapValue: 1
            });

        }


        if (req.query.sort === "high") {

            query = query.sort({
                swapValue: -1
            });

        }


        const page =
            Math.max(
                Number(req.query.page) || 1,
                1
            );


        const limit =
            Math.max(
                Number(req.query.limit) || 5,
                1
            );


        const skip =
            (page - 1) * limit;


        const total =
            await Listing.countDocuments(filter);


        const totalPages =
            Math.ceil(total / limit);


        const items =
            await query
                .skip(skip)
                .limit(limit);


        res.json({

            total,
            page,
            limit,
            totalPages,
            items

        });


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to get listings"
        );

    }

};


const getItem = async (req, res) => {

    try {

        const item =
            await Listing.findById(
                req.params.id
            );


        if (!item) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        res.json(item);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to get listing"
        );

    }

};


const updateItem = async (req, res) => {

    try {

        const item =
            await Listing.findById(
                req.params.id
            );


        if (!item) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        if (
            item.owner.toString()
            !== req.user.userId
        ) {

            return res.status(403).send(
                "You can only update your own listing"
            );

        }


        Object.assign(
            item,
            req.body
        );


        // Recalculate swap value
        // when calculator fields change
        if (
            req.body.category !== undefined ||
            req.body.brand !== undefined ||
            req.body.condition !== undefined
        ) {

            item.swapValue =
                await calculateSwapValue({

                    category: item.category,

                    brand: item.brand,

                    condition: item.condition

                });

        }


        await item.save();


        res.json(item);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to update listing"
        );

    }

};


const deleteItem = async (req, res) => {

    try {

        const item =
            await Listing.findById(
                req.params.id
            );


        if (!item) {

            return res.status(404).send(
                "Listing not found"
            );

        }


        if (
            item.owner.toString()
            !== req.user.userId
        ) {

            return res.status(403).send(
                "You can only delete your own listing"
            );

        }


        await Listing.findByIdAndDelete(
            req.params.id
        );


        res.send("Item Deleted");


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to delete listing"
        );

    }

};


const getMyListings = async (req, res) => {

    try {

        const listings =
            await Listing.find({
                owner: req.user.userId
            });


        res.json(listings);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to get your listings"
        );

    }

};


const getLocationMatches = async (req, res) => {

    try {

        // Get logged-in user's location
        const user = await User.findById(
            req.user.userId
        );

        if (!user) {

            return res.status(404).send(
                "User not found"
            );

        }


        const userLocation = user.location;


        // Get listings from same location first
        const matchingListings =
            await Listing.find({
                location: userLocation,
                status: "available",
                owner: {
                    $ne: req.user.userId
                }
            });


        // Get listings from other locations
        const otherListings =
            await Listing.find({
                location: {
                    $ne: userLocation
                },
                status: "available",
                owner: {
                    $ne: req.user.userId
                }
            });


        // Same-location listings first
        const listings = [
            ...matchingListings,
            ...otherListings
        ];


        res.json({

            userLocation,

            total: listings.length,

            matchingCount:
                matchingListings.length,

            listings

        });


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to get location matches"
        );

    }

};

export {
    createListing,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    getMyListings,
    getLocationMatches
};