import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    getAdminOverview,
    getAdminUsers,
    updateUserRole,
    deleteAdminUser,
    getAdminListings,
    deleteAdminListing,
    getAdminSwaps,
    getAdminReviews,
    getAdminReports,
    updateAdminReport
} from "../controllers/adminController.js";


const router = express.Router();


router.use(authMiddleware);
router.use(adminMiddleware);


// Dashboard
router.get(
    "/overview",
    getAdminOverview
);


// Users
router.get(
    "/users",
    getAdminUsers
);

router.delete(
    "/listings/:id",
    deleteAdminListing
);

router.put(
    "/users/:id/role",
    updateUserRole
);


// Listings
router.get(
    "/listings",
    getAdminListings
);


// Swaps
router.get(
    "/swaps",
    getAdminSwaps
);


// Reviews
router.get(
    "/reviews",
    getAdminReviews
);


// Reports
router.get(
    "/reports",
    getAdminReports
);

router.put(
    "/reports/:id",
    updateAdminReport
);


router.delete(
    "/users/:id",
    deleteAdminUser
);

export default router;