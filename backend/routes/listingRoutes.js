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
    getLocationMatches
} from "../controllers/listingController.js";


const router = express.Router();


router.post(
    "/", 
    authMiddleware,
    upload.single("image"),
    createListing
);
router.get("/", getItems);
router.get("/my", authMiddleware, getMyListings);
router.get(
    "/matches",
    authMiddleware,
    getLocationMatches
);
router.get("/:id", getItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);



export default router;
