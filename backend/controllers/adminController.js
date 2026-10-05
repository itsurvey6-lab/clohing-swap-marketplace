import User from "../models/user.js";
import Listing from "../models/listing.js";
import SwapRequest from "../models/swapRequest.js";
import Review from "../models/review.js";
import Report from "../models/report.js";


// ===============================
// ADMIN OVERVIEW
// ===============================

const getAdminOverview = async (req, res) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            totalListings,
            availableListings,
            swappedListings,
            totalSwaps,
            pendingSwaps,
            acceptedSwaps,
            completedSwaps,
            totalReviews,
            totalReports,
            pendingReports,
            resolvedReports
        ] = await Promise.all([

            User.countDocuments(),

            User.countDocuments({
                role: "admin"
            }),

            Listing.countDocuments(),

            Listing.countDocuments({
                status: "available"
            }),

            Listing.countDocuments({
                status: "swapped"
            }),

            SwapRequest.countDocuments(),

            SwapRequest.countDocuments({
                status: "pending"
            }),

            SwapRequest.countDocuments({
                status: "accepted"
            }),

            SwapRequest.countDocuments({
                status: "completed"
            }),

            Review.countDocuments(),

            Report.countDocuments(),

            Report.countDocuments({
                status: "pending"
            }),

            Report.countDocuments({
                status: "resolved"
            })
        ]);


        const ratingData = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }
        ]);


        const averageRating =
            ratingData.length > 0
                ? Number(
                    ratingData[0].averageRating.toFixed(1)
                )
                : 0;


        res.json({
            users: {
                total: totalUsers,
                admins: totalAdmins,
                normalUsers:
                    totalUsers - totalAdmins
            },

            listings: {
                total: totalListings,
                available: availableListings,
                swapped: swappedListings
            },

            swaps: {
                total: totalSwaps,
                pending: pendingSwaps,
                accepted: acceptedSwaps,
                completed: completedSwaps
            },

            reviews: {
                total: totalReviews,
                averageRating
            },

            reports: {
                total: totalReports,
                pending: pendingReports,
                resolved: resolvedReports
            }
        });

    } catch (error) {

        console.log(
            "Admin overview error:",
            error
        );

        res.status(500).send(
            "Unable to load admin overview"
        );
    }
};


// ===============================
// USERS
// ===============================

const getAdminUsers = async (req, res) => {
    try {

        const {
            search = "",
            role,
            location,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;


        const filter = {};


        if (role) {
            filter.role = role;
        }


        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }


        if (search) {

            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        const allowedSortFields = [
            "name",
            "email",
            "location",
            "role",
            "createdAt"
        ];


        const safeSort =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "createdAt";


        const sortOrder =
            order === "asc" ? 1 : -1;


        const users = await User.find(filter)
            .select("-password")
            .sort({
                [safeSort]: sortOrder
            });


        res.json({
            total: users.length,
            users
        });

    } catch (error) {

        console.log(
            "Admin users error:",
            error
        );

        res.status(500).send(
            "Unable to load users"
        );
    }
};


// ===============================
// UPDATE USER ROLE
// ===============================

const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;


        if (!["user", "admin"].includes(role)) {

            return res.status(400).send(
                "Invalid role"
            );
        }


        const user = await User.findById(id);

        if (!user) {

            return res.status(404).send(
                "User not found"
            );
        }


        user.role = role;

        await user.save();


        res.json({
            message: "User role updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.log(
            "Update user role error:",
            error
        );

        res.status(500).send(
            "Unable to update user role"
        );
    }
};


// ===============================
// LISTINGS
// ===============================

const getAdminListings = async (req, res) => {
    try {

        const {
            search = "",
            category,
            status,
            location,
            minValue,
            maxValue,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;


        const filter = {};


        if (category) {
            filter.category = category;
        }


        if (status) {
            filter.status = status;
        }


        if (location) {

            filter.location = {
                $regex: location,
                $options: "i"
            };

        }


        if (minValue !== undefined) {

            filter.swapValue = {
                ...filter.swapValue,
                $gte: Number(minValue)
            };

        }


        if (maxValue !== undefined) {

            filter.swapValue = {
                ...filter.swapValue,
                $lte: Number(maxValue)
            };

        }


        if (search) {

            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        const allowedSortFields = [
            "title",
            "category",
            "brand",
            "swapValue",
            "location",
            "status",
            "createdAt"
        ];


        const safeSort =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "createdAt";


        const sortOrder =
            order === "asc" ? 1 : -1;


        const listings =
            await Listing.find(filter)
                .populate(
                    "owner",
                    "name email location role"
                )
                .sort({
                    [safeSort]: sortOrder
                });


        res.json({
            total: listings.length,
            listings
        });

    } catch (error) {

        console.log(
            "Admin listings error:",
            error
        );

        res.status(500).send(
            "Unable to load listings"
        );
    }
};



const deleteAdminListing = async (req, res) => {
    try {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send(
                "Listing not found"
            );
        }

        await Listing.findByIdAndDelete(id);

        res.json({
            message: "Listing deleted successfully"
        });

    } catch (error) {

        console.log(
            "Delete admin listing error:",
            error
        );

        res.status(500).send(
            "Unable to delete listing"
        );
    }
};

// ===============================
// SWAPS
// ===============================

const getAdminSwaps = async (req, res) => {
    try {

        const {
            status,
            deliveryMethod,
            courierStatus,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;


        const filter = {};


        if (status) {
            filter.status = status;
        }


        if (deliveryMethod) {
            filter.deliveryMethod =
                deliveryMethod;
        }


        if (courierStatus) {
            filter.courierStatus =
                courierStatus;
        }


        const allowedSortFields = [
            "status",
            "deliveryMethod",
            "courierStatus",
            "createdAt",
            "updatedAt"
        ];


        const safeSort =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "createdAt";


        const sortOrder =
            order === "asc" ? 1 : -1;


        const swaps =
            await SwapRequest.find(filter)
                .populate(
                    "requester",
                    "name email location"
                )
                .populate(
                    "listing",
                    "title category brand size condition swapValue location status owner"
                )
                .populate(
                    "offeredListing",
                    "title category brand size condition swapValue location status owner"
                )
                .sort({
                    [safeSort]: sortOrder
                });


        res.json({
            total: swaps.length,
            swaps
        });

    } catch (error) {

        console.log(
            "Admin swaps error:",
            error
        );

        res.status(500).send(
            "Unable to load swaps"
        );
    }
};


// ===============================
// REVIEWS
// ===============================

const getAdminReviews = async (req, res) => {
    try {

        const {
            rating,
            search = "",
            sortBy = "createdAt",
            order = "desc"
        } = req.query;


        const filter = {};


        if (rating) {
            filter.rating = Number(rating);
        }


        const allowedSortFields = [
            "rating",
            "createdAt"
        ];


        const safeSort =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "createdAt";


        const sortOrder =
            order === "asc" ? 1 : -1;


        let reviews =
            await Review.find(filter)
                .populate(
                    "reviewer",
                    "name email"
                )
                .populate(
                    "reviewedUser",
                    "name email"
                )
                .populate(
                    "swapRequest",
                    "status deliveryMethod createdAt"
                )
                .sort({
                    [safeSort]: sortOrder
                });


        if (search) {

            const searchLower =
                search.toLowerCase();


            reviews =
                reviews.filter(review =>
                    review.comment
                        ?.toLowerCase()
                        .includes(searchLower) ||

                    review.reviewer?.name
                        ?.toLowerCase()
                        .includes(searchLower) ||

                    review.reviewedUser?.name
                        ?.toLowerCase()
                        .includes(searchLower)
                );
        }


        res.json({
            total: reviews.length,
            reviews
        });

    } catch (error) {

        console.log(
            "Admin reviews error:",
            error
        );

        res.status(500).send(
            "Unable to load reviews"
        );
    }
};


// ===============================
// REPORTS
// ===============================

const getAdminReports = async (req, res) => {
    try {

        const {
            status,
            search = "",
            sortBy = "createdAt",
            order = "desc"
        } = req.query;


        const filter = {};


        if (status) {
            filter.status = status;
        }


        const allowedSortFields = [
            "reason",
            "status",
            "createdAt",
            "updatedAt"
        ];


        const safeSort =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "createdAt";


        const sortOrder =
            order === "asc" ? 1 : -1;


        let reports =
            await Report.find(filter)
                .populate(
                    "reporter",
                    "name email location role"
                )
                .populate(
                    "reportedUser",
                    "name email location role"
                )
                .populate(
                    "listing",
                    "title category brand size condition swapValue location status owner"
                )
                .sort({
                    [safeSort]: sortOrder
                });


        if (search) {

            const searchLower =
                search.toLowerCase();


            reports =
                reports.filter(report =>

                    report.reason
                        ?.toLowerCase()
                        .includes(searchLower) ||

                    report.reporter?.name
                        ?.toLowerCase()
                        .includes(searchLower) ||

                    report.reporter?.email
                        ?.toLowerCase()
                        .includes(searchLower) ||

                    report.reportedUser?.name
                        ?.toLowerCase()
                        .includes(searchLower) ||

                    report.listing?.title
                        ?.toLowerCase()
                        .includes(searchLower)
                );
        }


        res.json({
            total: reports.length,
            reports
        });

    } catch (error) {

        console.log(
            "Admin reports error:",
            error
        );

        res.status(500).send(
            "Unable to load reports"
        );
    }
};


// ===============================
// UPDATE REPORT
// ===============================

const updateAdminReport = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;


        if (
            ![
                "pending",
                "reviewed",
                "resolved"
            ].includes(status)
        ) {

            return res.status(400).send(
                "Invalid report status"
            );
        }


        const report =
            await Report.findById(id);


        if (!report) {

            return res.status(404).send(
                "Report not found"
            );
        }


        report.status = status;

        await report.save();


        res.json({
            message: "Report status updated",
            report
        });

    } catch (error) {

        console.log(
            "Update report error:",
            error
        );

        res.status(500).send(
            "Unable to update report"
        );
    }
};

const deleteAdminUser = async (req, res) => {
    try {

        const { id } = req.params;

        // Prevent admin from deleting their own account
        if (id === req.user.userId) {
            return res.status(400).send(
                "You cannot delete your own admin account"
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send(
                "User not found"
            );
        }

        await User.findByIdAndDelete(id);

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(
            "Delete admin user error:",
            error
        );

        res.status(500).send(
            "Unable to delete user"
        );
    }
};


export {
    getAdminOverview,
    getAdminUsers,
    updateUserRole,
    deleteAdminUser,
    getAdminListings,
    deleteAdminListing,
    getAdminSwaps,
    getAdminReviews,
    getAdminReports,
    updateAdminReport
};