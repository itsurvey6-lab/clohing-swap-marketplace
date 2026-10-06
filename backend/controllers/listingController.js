import Listing from "../models/listing.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import calculateSwapValue from "../utils/swapValueCalculator.js";


// =====================================================
// SAVE IMAGE TO MONGODB GRIDFS
// =====================================================

const uploadImageToGridFS = (file) => {

    return new Promise((resolve, reject) => {

        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            {
                bucketName: "listingImages"
            }
        );

        const uploadStream =
            bucket.openUploadStream(
                file.originalname,
                {
                    contentType: file.mimetype
                }
            );

        uploadStream.on(
            "error",
            reject
        );

        uploadStream.on(
            "finish",
            () => {
                resolve(
                    uploadStream.id.toString()
                );
            }
        );

        uploadStream.end(
            file.buffer
        );

    });

};


// =====================================================
// CREATE LISTING
// =====================================================

const createListing = async (req, res) => {

    try {

        const {
            category,
            brand,
            condition
        } = req.body;


        // Calculate swap value
        const swapValue =
            await calculateSwapValue({
                category,
                brand,
                condition
            });


        let image = null;

        let images = [];


        // =================================================
        // SAVE MULTIPLE IMAGES
        // =================================================

        if (
            req.files &&
            req.files.length > 0
        ) {

            for (
                const file of req.files
            ) {

                const fileId =
                    await uploadImageToGridFS(
                        file
                    );

                images.push(
                    `gridfs:${fileId}`
                );

            }


            // First image = main image
            image = images[0];

        }


        // =================================================
        // CREATE LISTING
        // =================================================

        const listing =
            new Listing({

                ...req.body,

                image,

                images,

                owner:
                    req.user.userId,

                swapValue

            });


        await listing.save();


        res.status(201).json(
            listing
        );


    } catch (error) {

        console.log(
            "Create listing error:",
            error
        );

        res.status(500).send(
            "Unable to create listing"
        );

    }

};


// =====================================================
// GET ALL LISTINGS
// =====================================================

const getItems = async (req, res) => {

    try {

        const filter = {};


        if (req.query.category) {
            filter.category =
                req.query.category;
        }


        if (req.query.brand) {
            filter.brand =
                req.query.brand;
        }


        if (req.query.size) {
            filter.size =
                req.query.size;
        }


        if (req.query.location) {
            filter.location =
                req.query.location;
        }


        if (req.query.condition) {
            filter.condition =
                req.query.condition;
        }


        if (req.query.status) {
            filter.status =
                req.query.status;
        }


        if (
            req.query.minValue ||
            req.query.maxValue
        ) {

            filter.swapValue = {};


            if (req.query.minValue) {

                filter.swapValue.$gte =
                    Number(
                        req.query.minValue
                    );

            }


            if (req.query.maxValue) {

                filter.swapValue.$lte =
                    Number(
                        req.query.maxValue
                    );

            }

        }


        let query =
            Listing.find(filter);


        if (
            req.query.sort === "low"
        ) {

            query = query.sort({
                swapValue: 1
            });

        }


        if (
            req.query.sort === "high"
        ) {

            query = query.sort({
                swapValue: -1
            });

        }


        const page =
            Math.max(
                Number(
                    req.query.page
                ) || 1,
                1
            );


        const limit =
            Math.max(
                Number(
                    req.query.limit
                ) || 5,
                1
            );


        const skip =
            (page - 1) * limit;


        const total =
            await Listing.countDocuments(
                filter
            );


        const totalPages =
            Math.ceil(
                total / limit
            );


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


// =====================================================
// GET SINGLE LISTING
// =====================================================

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


// =====================================================
// UPDATE LISTING
// =====================================================

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
            item.owner.toString() !==
            req.user.userId
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
        if (
            req.body.category !==
                undefined ||
            req.body.brand !==
                undefined ||
            req.body.condition !==
                undefined
        ) {

            item.swapValue =
                await calculateSwapValue({

                    category:
                        item.category,

                    brand:
                        item.brand,

                    condition:
                        item.condition

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


// =====================================================
// DELETE LISTING
// =====================================================

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
            item.owner.toString() !==
            req.user.userId
        ) {

            return res.status(403).send(
                "You can only delete your own listing"
            );

        }


        await Listing.findByIdAndDelete(
            req.params.id
        );


        res.send(
            "Item Deleted"
        );


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to delete listing"
        );

    }

};


// =====================================================
// MY LISTINGS
// =====================================================

const getMyListings = async (req, res) => {

    try {

        const listings =
            await Listing.find({
                owner:
                    req.user.userId
            });


        res.json(listings);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to get your listings"
        );

    }

};


// =====================================================
// LOCATION MATCHES
// =====================================================

const getLocationMatches = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.user.userId
            );


        if (!user) {

            return res.status(404).send(
                "User not found"
            );

        }


        const userLocation =
            user.location;


        const matchingListings =
            await Listing.find({

                location:
                    userLocation,

                status:
                    "available",

                owner: {
                    $ne:
                        req.user.userId
                }

            });


        const otherListings =
            await Listing.find({

                location: {
                    $ne:
                        userLocation
                },

                status:
                    "available",

                owner: {
                    $ne:
                        req.user.userId
                }

            });


        const listings = [

            ...matchingListings,

            ...otherListings

        ];


        res.json({

            userLocation,

            total:
                listings.length,

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


// =====================================================
// GET GRIDFS IMAGE
// =====================================================

const getListingImage = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        if (
            !mongoose.isValidObjectId(id)
        ) {

            return res.status(400).send(
                "Invalid image ID"
            );

        }


        const fileId =
            new mongoose.Types.ObjectId(
                id
            );


        const bucket =
            new mongoose.mongo.GridFSBucket(
                mongoose.connection.db,
                {
                    bucketName:
                        "listingImages"
                }
            );


        const files =
            await bucket
                .find({
                    _id:
                        fileId
                })
                .toArray();


        if (
            !files.length
        ) {

            return res.status(404).send(
                "Image not found"
            );

        }


        const file =
            files[0];


        res.set(
            "Content-Type",
            file.contentType ||
            "image/jpeg"
        );


        res.set(
            "Cache-Control",
            "public, max-age=31536000"
        );


        bucket
            .openDownloadStream(
                fileId
            )
            .on(
                "error",
                (error) => {

                    console.log(
                        "Image stream error:",
                        error
                    );

                    if (
                        !res.headersSent
                    ) {

                        res.status(
                            500
                        ).end();

                    }

                }
            )
            .pipe(res);


    } catch (error) {

        console.log(
            "Get listing image error:",
            error
        );

        res.status(500).send(
            "Unable to load image"
        );

    }

};


// =====================================================
// EXPORT
// =====================================================

export {

    createListing,

    getItems,

    getItem,

    updateItem,

    deleteItem,

    getMyListings,

    getLocationMatches,

    getListingImage

};