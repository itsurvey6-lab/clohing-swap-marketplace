import SwapRequest from "../models/swapRequest.js";
import Message from "../models/message.js";

const sendMessage = async (req, res) => {

    const { receiver, swapRequest, message } = req.body;

    const request = await SwapRequest.findById(swapRequest)
        .populate("listing");

    if (!request) {
        return res.status(404).send("Swap request not found");
    }

    const requesterId = request.requester.toString();
    const listingOwnerId = request.listing.owner.toString();
    const senderId = req.user.userId;

    // Sender must be part of this swap
    if (senderId !== requesterId && senderId !== listingOwnerId) {
        return res.status(403).send(
            "You are not part of this swap"
        );
    }

    // Receiver must be the other participant
    if (receiver === senderId) {
        return res.status(400).send(
            "You cannot send a message to yourself"
        );
    }

    if (receiver !== requesterId && receiver !== listingOwnerId) {
        return res.status(403).send(
            "Receiver is not part of this swap"
        );
    }

    const newMessage = new Message({

        sender: senderId,
        receiver,
        swapRequest,
        message

    });

    await newMessage.save();

    res.json(newMessage);
};


const getMessages = async (req, res) => {

    const request = await SwapRequest.findById(
        req.params.swapRequestId
    ).populate("listing");

    if (!request) {
        return res.status(404).send("Swap request not found");
    }

    const requesterId = request.requester.toString();
    const listingOwnerId = request.listing.owner.toString();
    const userId = req.user.userId;

    if (userId !== requesterId && userId !== listingOwnerId) {
        return res.status(403).send(
            "You are not part of this swap"
        );
    }

    const messages = await Message.find({
        swapRequest: req.params.swapRequestId
    })
    .populate("sender", "-password")
    .populate("receiver", "-password");


    res.json(messages);
};











export {
    sendMessage,
    getMessages
};