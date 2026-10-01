const adminMiddleware = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).send("Admin access required");
    }

    next();
};

export default adminMiddleware;