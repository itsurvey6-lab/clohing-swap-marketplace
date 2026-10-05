const adminMiddleware = (req, res, next) => {

    if (!req.user) {
        return res.status(401).send(
            "Authentication required"
        );
    }

    if (req.user.role !== "admin") {
        return res.status(403).send(
            "Admin access required"
        );
    }

    next();
};

export default adminMiddleware;