import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    createSwapRequest,
    getMySwapRequests,
    getIncomingSwapRequests,
    updateSwapRequest
} from "../controllers/swapRequestController.js";

const router = express.Router();

router.post("/", authMiddleware, createSwapRequest);

router.get("/my", authMiddleware, getMySwapRequests);

router.get("/incoming", authMiddleware, getIncomingSwapRequests);

router.put("/:id", authMiddleware, updateSwapRequest);

export default router;