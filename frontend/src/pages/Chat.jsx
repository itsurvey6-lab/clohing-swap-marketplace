import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import api from "../services/api";

function Chat() {

    const { swapRequestId } = useParams();

    const [messages, setMessages] = useState([]);
    const [swapRequest, setSwapRequest] = useState(null);

    const [loading, setLoading] = useState(true);

    const [messageText, setMessageText] = useState("");
    const [receiverId, setReceiverId] = useState("");

    const [socket, setSocket] = useState(null);

    const messagesEndRef = useRef(null);


    // GET CURRENT USER ID FROM TOKEN
    const token = localStorage.getItem("token");

    const currentUserId = token
        ? JSON.parse(atob(token.split(".")[1])).userId
        : null;


    // LOAD CHAT DATA
    const fetchChatData = async () => {

        try {

            const messageResponse = await api.get(
                `/messages/${swapRequestId}`
            );

            console.log(
                "Messages:",
                messageResponse.data
            );

            setMessages(messageResponse.data);


            const myResponse = await api.get(
                "/swaprequests/my"
            );

            const incomingResponse = await api.get(
                "/swaprequests/incoming"
            );


            const myRequests =
                myResponse.data.items ||
                myResponse.data ||
                [];


            const incomingRequests =
                incomingResponse.data.items ||
                incomingResponse.data ||
                [];


            const myRequest = myRequests.find(
                (request) =>
                    request._id === swapRequestId
            );


            const incomingRequest =
                incomingRequests.find(
                    (request) =>
                        request._id === swapRequestId
                );


            const request =
                myRequest ||
                incomingRequest ||
                null;


            console.log(
                "Swap request:",
                request
            );

            setSwapRequest(request);


            // If I created the request,
            // receiver is the owner of wanted listing
            if (myRequest) {

                setReceiverId(
                    request.listing?.owner?._id ||
                    request.listing?.owner
                );

            }


            // If I received the request,
            // receiver is the requester
            if (incomingRequest) {

                setReceiverId(
                    request.requester?._id ||
                    request.requester
                );

            }

        } catch (error) {

            console.log(
                "Error loading chat:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // SEND MESSAGE
    const sendMessage = async () => {

        if (!messageText.trim()) {
            return;
        }


        if (!receiverId) {

            alert("Receiver not found");

            return;

        }


        if (!socket) {

            alert("Chat connection is not ready");

            return;

        }


        try {

            // Save message using REST API
            const response = await api.post(
                "/messages",
                {
                    receiver: receiverId,
                    swapRequest: swapRequestId,
                    message: messageText
                }
            );


            console.log(
                "Message saved:",
                response.data
            );


            // Show message immediately
            // for the sender
            setMessages(
                (previousMessages) => [
                    ...previousMessages,
                    response.data
                ]
            );


            // Send saved message
            // to the other user
            socket.emit(
                "sendMessage",
                {
                    swapRequestId,
                    message: response.data
                }
            );


            // Clear input
            setMessageText("");

        } catch (error) {

            console.log(
                "Send message error:",
                error
            );


            alert(
                error.response?.data ||
                "Unable to send message"
            );

        }

    };


    // CONNECT TO SOCKET.IO
    useEffect(() => {

        const newSocket = io(
            "http://localhost:5000"
        );


        setSocket(newSocket);


        return () => {

            newSocket.disconnect();

        };

    }, []);


    // LOAD CHAT DATA
    useEffect(() => {

        fetchChatData();

    }, [swapRequestId]);


    // JOIN SOCKET.IO ROOM
    useEffect(() => {

        if (!socket || !swapRequest) {
            return;
        }


        const token =
            localStorage.getItem("token");


        if (!token) {
            return;
        }


        const payload =
            JSON.parse(
                atob(token.split(".")[1])
            );


        const userId = payload.userId;


        socket.emit(
            "joinSwapRoom",
            swapRequestId,
            userId
        );


        console.log(
            "Joined room:",
            swapRequestId
        );


    }, [
        socket,
        swapRequest,
        swapRequestId
    ]);


    // RECEIVE REAL-TIME MESSAGE
    useEffect(() => {

        if (!socket) {
            return;
        }


        const handleReceiveMessage =
            (data) => {

                console.log(
                    "New message received:",
                    data
                );


                setMessages(
                    (previousMessages) => [

                        ...previousMessages,

                        data.message

                    ]
                );

            };


        socket.on(
            "receiveMessage",
            handleReceiveMessage
        );


        return () => {

            socket.off(
                "receiveMessage",
                handleReceiveMessage
            );

        };


    }, [socket]);


    // AUTO SCROLL TO NEWEST MESSAGE
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    // LOADING SCREEN
    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <p>
                    Loading chat...
                </p>

            </div>

        );

    }


    // REQUEST NOT FOUND
    if (!swapRequest) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <p>
                    Swap request not found.
                </p>

            </div>

        );

    }


    return (

        <main className="min-h-screen bg-stone-50 py-10 px-6">

            <div className="max-w-3xl mx-auto">


                {/* HEADER */}

                <h1 className="text-3xl font-bold text-gray-900">
                    Chat
                </h1>


                <p className="text-gray-500 mt-2">
                    Swap Request ID: {swapRequestId}
                </p>



                {/* SWAP INFORMATION */}

                <div className="bg-white border border-stone-200 rounded-2xl p-5 mt-6">

                    <p className="font-semibold text-gray-900">
                        Swap Request Information
                    </p>


                    <p className="text-sm text-gray-500 mt-3">
                        Requester:{" "}
                        {swapRequest.requester?.name}
                    </p>


                    <p className="text-sm text-gray-500">
                        Wanted Item:{" "}
                        {swapRequest.listing?.title}
                    </p>


                    <p className="text-sm text-gray-500">
                        Offered Item:{" "}
                        {swapRequest.offeredListing?.title}
                    </p>


                    <p className="text-sm text-gray-500">
                        Status:{" "}
                        {swapRequest.status}
                    </p>

                </div>



                {/* CHAT BOX */}

                <div className="bg-white border border-stone-200 rounded-2xl p-6 mt-6">


                    {/* MESSAGES */}

                    <div className="min-h-[300px] max-h-[500px] overflow-y-auto pr-2">


                        {messages.length === 0 ? (

                            <p className="text-gray-500 text-center py-20">

                                No messages yet.

                            </p>

                        ) : (

                            messages.map((message) => {


                                const senderId =
                                    message.sender?._id ||
                                    message.sender;


                                const isMine =
                                    senderId?.toString() ===
                                    currentUserId?.toString();


                                return (

                                    <div
                                        key={message._id}
                                        className={`flex mb-4 ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >


                                        <div
                                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                                                isMine
                                                    ? "bg-green-700 text-white rounded-br-md"
                                                    : "bg-stone-100 text-gray-800 rounded-bl-md"
                                            }`}
                                        >


                                            {!isMine && (

                                                <p className="text-xs font-semibold mb-1 text-gray-500">

                                                    {message.sender?.name ||
                                                        "User"}

                                                </p>

                                            )}


                                            <p className="text-sm">

                                                {message.message}

                                            </p>


                                        </div>

                                    </div>

                                );

                            })

                        )}


                        {/* SCROLL TARGET */}

                        <div ref={messagesEndRef} />

                    </div>



                    {/* MESSAGE INPUT */}

                    <div className="mt-6 flex gap-3">


                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) =>
                                setMessageText(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter"
                                ) {

                                    sendMessage();

                                }

                            }}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
                        />


                        <button
                            onClick={sendMessage}
                            className="px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition"
                        >
                            Send
                        </button>


                    </div>


                </div>


            </div>

        </main>

    );

}


export default Chat;