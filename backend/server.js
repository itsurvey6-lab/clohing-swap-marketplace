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

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors({
    origin: "http://localhost:5173"
}));

connectDB();

app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/swaprequests", swapRequestRoutes);
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/reports", reportRoutes);
app.use("/favorites", favoriteRoutes);



const server = app.listen(5000, () => {
    console.log("server is running on port 5000");
});



const io = new Server(server);

io.on("connection", (socket) => {

    socket.on("sendMessage", (data) => {

        const { swapRequestId, message } = data;

        io.to(`swap_${swapRequestId}`).emit(
            "receiveMessage",
            data
        );

    });

    console.log("User connected:", socket.id);

    socket.on("joinSwapRoom", async (swapRequestId, userId) => {

        const request = await SwapRequest.findById(swapRequestId)
            .populate("listing");

        if (!request) {
            return socket.emit(
                "errorMessage",
                "Swap request not found"
            );
        }

        const requesterId = request.requester.toString();
        const listingOwnerId = request.listing.owner.toString();

        if (
            userId !== requesterId &&
            userId !== listingOwnerId
        ) {
            return socket.emit(
                "errorMessage",
                "You are not part of this swap"
            );
        }

        socket.join(`swap_${swapRequestId}`);

        console.log(
            `User joined swap room: ${swapRequestId}`
        );

    });

});