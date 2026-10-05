import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    getSwapValueSettings,
    createSwapValueSetting,
    updateSwapValueSetting,
    deleteSwapValueSetting
} from "../controllers/swapValueSettingController.js";


const router = express.Router();


// GET ALL SWAP VALUE SETTINGS
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getSwapValueSettings
);


// CREATE SWAP VALUE SETTING
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createSwapValueSetting
);


// UPDATE SWAP VALUE SETTING
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateSwapValueSetting
);


// DELETE SWAP VALUE SETTING
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteSwapValueSetting
);


export default router;