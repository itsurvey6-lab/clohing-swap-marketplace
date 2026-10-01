import express from "express";

import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getMyProfile
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/me", authMiddleware, getMyProfile);

router.get("/:id", getUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;