import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import swapRequestRoutes from "./routes/swapRequestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import SwapRequest from "./models/swapRequest.js";
import { Server } from "socket.io";
import reportRoutes from "./routes/reportRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import cors from "cors";
import swapValueSettingRoutes from "./routes/swapValueSettingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Render provides the PORT automatically.
// 5000 is used when running locally.
const PORT = process.env.PORT || 5000;

// Frontend URL
const CLIENT_URL =
    process.env.CLIENT_URL || "http://localhost:5173";


// ==========================
// MIDDLEWARE
// ==========================

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// CORS
app.use(
    cors({
        origin: CLIENT_URL,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ==========================
// DATABASE
// ==========================

connectDB();


// ==========================
// ROUTES
// ==========================

app.use("/users", userRoutes);

app.use("/listings", listingRoutes);

app.use("/swaprequests", swapRequestRoutes);

app.use("/auth", authRoutes);

app.use("/messages", messageRoutes);

app.use("/reports", reportRoutes);

app.use("/favorites", favoriteRoutes);

app.use("/reviews", reviewRoutes);

app.use("/admin", adminRoutes);

app.use(
    "/swapvalues",
    swapValueSettingRoutes
);


// ==========================
// START SERVER
// ==========================

const server = app.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT}`
    );
});


// ==========================
// SOCKET.IO
// ==========================

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"]
    }
});


io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );


    // ==========================
    // SEND REAL-TIME MESSAGE
    // ==========================

    socket.on("sendMessage", (data) => {

        const {
            swapRequestId,
            message
        } = data;

        socket
            .to(`swap_${swapRequestId}`)
            .emit(
                "receiveMessage",
                {
                    swapRequestId,
                    message
                }
            );

    });


    // ==========================
    // JOIN SWAP ROOM
    // ==========================

    socket.on(
        "joinSwapRoom",
        async (
            swapRequestId,
            userId
        ) => {

            try {

                const request =
                    await SwapRequest
                        .findById(swapRequestId)
                        .populate("listing");


                if (!request) {

                    return socket.emit(
                        "errorMessage",
                        "Swap request not found"
                    );

                }


                const requesterId =
                    request.requester.toString();

                const listingOwnerId =
                    request.listing.owner.toString();


                // Only requester or listing owner
                // can join this room
                if (
                    userId !== requesterId &&
                    userId !== listingOwnerId
                ) {

                    return socket.emit(
                        "errorMessage",
                        "You are not part of this swap"
                    );

                }


                socket.join(
                    `swap_${swapRequestId}`
                );


                console.log(
                    `User joined swap room: ${swapRequestId}`
                );

            } catch (error) {

                console.log(
                    "Socket room error:",
                    error
                );

            }

        }
    );


    // ==========================
    // DISCONNECT
    // ==========================

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});