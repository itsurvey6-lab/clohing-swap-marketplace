import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {

    createSwapRequest,

    getMySwapRequests,

    getIncomingSwapRequests,

    updateSwapRequest,

    startCourierDelivery,

    updateCourierStatus,

    updateCourierInformation

} from "../controllers/swapRequestController.js";


const router =
    express.Router();


// =====================================================
// SWAP REQUESTS
// =====================================================

router.post(
    "/",
    authMiddleware,
    createSwapRequest
);


router.get(
    "/my",
    authMiddleware,
    getMySwapRequests
);


router.get(
    "/incoming",
    authMiddleware,
    getIncomingSwapRequests
);


// =====================================================
// COURIER ROUTES
// IMPORTANT: These must come before /:id
// =====================================================

router.put(
    "/:id/courier",
    authMiddleware,
    startCourierDelivery
);


router.put(
    "/:id/courier/status",
    authMiddleware,
    updateCourierStatus
);


router.put(
    "/:id/courier/info",
    authMiddleware,
    updateCourierInformation
);


// =====================================================
// NORMAL SWAP UPDATE
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    updateSwapRequest
);


export default router;