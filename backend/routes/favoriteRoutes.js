import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    addFavorite,
    getMyFavorites,
    removeFavorite
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/add", authMiddleware, addFavorite);

router.get("/my", authMiddleware, getMyFavorites);

router.delete("/:id", authMiddleware, removeFavorite);

export default router;