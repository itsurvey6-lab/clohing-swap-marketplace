import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    register,
    login
} from "../controllers/authController.js";

import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getMyProfile
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMyProfile);

export default router;