import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
    createListing,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    getMyListings,
    getLocationMatches,
    getListingImage
} from "../controllers/listingController.js";


const router = express.Router();


// =====================================================
// CREATE LISTING
// Up to 6 images
// =====================================================

router.post(
    "/",
    authMiddleware,
    upload.array("image", 6),
    createListing
);


// =====================================================
// LISTINGS
// =====================================================

router.get(
    "/",
    getItems
);


// =====================================================
// MY LISTINGS
// =====================================================

router.get(
    "/my",
    authMiddleware,
    getMyListings
);


// =====================================================
// LOCATION MATCHES
// =====================================================

router.get(
    "/matches",
    authMiddleware,
    getLocationMatches
);


// =====================================================
// GRIDFS IMAGE
// IMPORTANT: before /:id
// =====================================================

router.get(
    "/image/:id",
    getListingImage
);


// =====================================================
// SINGLE LISTING
// =====================================================

router.get(
    "/:id",
    getItem
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    updateItem
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    deleteItem
);


export default router;