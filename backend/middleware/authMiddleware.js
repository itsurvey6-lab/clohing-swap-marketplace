import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send("No token provided");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).send("Invalid authorization format");
    }

    const token = parts[1];

    if (!token) {
        return res.status(401).send("No token provided");
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).send("Invalid token");

    }
};

export default authMiddleware;