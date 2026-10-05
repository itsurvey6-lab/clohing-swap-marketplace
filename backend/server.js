import express from "express";
import cors from "cors";
import { Server } from "socket.io";

// ... your other imports

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://clohing-swap-marketplace.vercel.app"
];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {

        // Allow requests without an origin
        // such as server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error("Not allowed by CORS")
        );
    },

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
    ],

    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle browser preflight requests
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// your other middleware/routes below