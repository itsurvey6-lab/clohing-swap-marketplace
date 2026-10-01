import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    createReport,
    getReports,
    updateReport
} from "../controllers/reportController.js";


const router = express.Router();


router.post("/", authMiddleware, createReport);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getReports
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateReport
);

export default router;