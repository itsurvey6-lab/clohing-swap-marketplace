import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function AdminDashboard() {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");

    const [overview, setOverview] = useState(null);
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [swaps, setSwaps] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reports, setReports] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");
    const [rating, setRating] = useState("");

    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };


    // =====================================
    // LOAD OVERVIEW
    // =====================================

    const loadOverview = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API}/admin/overview`,
                { headers }
            );

            setOverview(response.data);

        } catch (error) {

            console.log("Overview error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                navigate("/");
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD USERS
    // =====================================

    const loadUsers = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            if (search)
                params.append("search", search);

            if (role)
                params.append("role", role);

            params.append("sortBy", sortBy);
            params.append("order", order);

            const response = await axios.get(
                `${API}/admin/users?${params.toString()}`,
                { headers }
            );

            setUsers(response.data.users);

        } catch (error) {

            console.log("Users error:", error);

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD LISTINGS
    // =====================================

    const loadListings = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            if (search)
                params.append("search", search);

            if (status)
                params.append("status", status);

            params.append("sortBy", sortBy);
            params.append("order", order);

            const response = await axios.get(
                `${API}/admin/listings?${params.toString()}`,
                { headers }
            );

            setListings(response.data.listings);

        } catch (error) {

            console.log("Listings error:", error);

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD SWAPS
    // =====================================

    const loadSwaps = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            if (status)
                params.append("status", status);

            params.append("sortBy", sortBy);
            params.append("order", order);

            const response = await axios.get(
                `${API}/admin/swaps?${params.toString()}`,
                { headers }
            );

            setSwaps(response.data.swaps);

        } catch (error) {

            console.log("Swaps error:", error);

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD REVIEWS
    // =====================================

    const loadReviews = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            if (search)
                params.append("search", search);

            if (rating)
                params.append("rating", rating);

            params.append("sortBy", sortBy);
            params.append("order", order);

            const response = await axios.get(
                `${API}/admin/reviews?${params.toString()}`,
                { headers }
            );

            setReviews(response.data.reviews);

        } catch (error) {

            console.log("Reviews error:", error);

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD REPORTS
    // =====================================

    const loadReports = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            if (search)
                params.append("search", search);

            if (status)
                params.append("status", status);

            params.append("sortBy", sortBy);
            params.append("order", order);

            const response = await axios.get(
                `${API}/admin/reports?${params.toString()}`,
                { headers }
            );

            setReports(response.data.reports);

        } catch (error) {

            console.log("Reports error:", error);

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD CURRENT TAB
    // =====================================

    useEffect(() => {

        if (!token) {

            navigate("/login");

            return;
        }

        if (activeTab === "overview")
            loadOverview();

        if (activeTab === "users")
            loadUsers();

        if (activeTab === "listings")
            loadListings();

        if (activeTab === "swaps")
            loadSwaps();

        if (activeTab === "reviews")
            loadReviews();

        if (activeTab === "reports")
            loadReports();

    }, [
        activeTab,
        search,
        status,
        role,
        rating,
        sortBy,
        order
    ]);


    // =====================================
    // CHANGE USER ROLE
    // =====================================

    const changeRole = async (userId, newRole) => {

        try {

            await axios.put(
                `${API}/admin/users/${userId}/role`,
                {
                    role: newRole
                },
                { headers }
            );

            loadUsers();

        } catch (error) {

            alert(
                error.response?.data ||
                "Unable to update role"
            );

        }
    };


    // =====================================
    // DELETE USER
    // =====================================

    const deleteUser = async (userId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed)
            return;

        try {

            await axios.delete(
                `${API}/admin/users/${userId}`,
                { headers }
            );

            loadUsers();

        } catch (error) {

            alert(
                error.response?.data ||
                "Unable to delete user"
            );

        }
    };


    // =====================================
    // DELETE LISTING
    // =====================================

    const deleteListing = async (listingId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this listing?"
        );

        if (!confirmed)
            return;

        try {

            await axios.delete(
                `${API}/admin/listings/${listingId}`,
                { headers }
            );

            loadListings();

        } catch (error) {

            alert(
                error.response?.data ||
                "Unable to delete listing"
            );

        }
    };


    // =====================================
    // UPDATE REPORT
    // =====================================

    const updateReport = async (
        reportId,
        newStatus
    ) => {

        try {

            await axios.put(
                `${API}/admin/reports/${reportId}`,
                {
                    status: newStatus
                },
                { headers }
            );

            loadReports();

        } catch (error) {

            alert(
                error.response?.data ||
                "Unable to update report"
            );

        }
    };


    // =====================================
    // CLEAR FILTERS
    // =====================================

    const clearFilters = () => {

        setSearch("");
        setStatus("");
        setRole("");
        setRating("");
        setSortBy("createdAt");
        setOrder("desc");

    };


    // =====================================
    // VIEW USER
    // =====================================

    const viewUser = (user) => {

        alert(
            `Name: ${user.name}\n` +
            `Email: ${user.email}\n` +
            `Location: ${user.location}\n` +
            `Role: ${user.role}`
        );

    };


    // =====================================
    // VIEW LISTING
    // =====================================

    const viewListing = (listing) => {

        alert(
            `Title: ${listing.title}\n` +
            `Category: ${listing.category}\n` +
            `Brand: ${listing.brand}\n` +
            `Size: ${listing.size}\n` +
            `Condition: ${listing.condition}\n` +
            `Owner: ${listing.owner?.name || "—"}\n` +
            `Location: ${listing.location}\n` +
            `Swap Value: ${listing.swapValue}\n` +
            `Status: ${listing.status}`
        );

    };


    // =====================================
    // VIEW SWAP
    // =====================================

    const viewSwap = (swap) => {

        alert(
            `Requester: ${swap.requester?.name || "—"}\n` +
            `Requested Item: ${swap.listing?.title || "—"}\n` +
            `Offered Item: ${swap.offeredListing?.title || "—"}\n` +
            `Status: ${swap.status}\n` +
            `Delivery: ${swap.deliveryMethod || "—"}\n` +
            `Courier Status: ${swap.courierStatus || "—"}\n` +
            `Courier: ${swap.courierName || "—"}\n` +
            `Tracking: ${swap.trackingNumber || "—"}`
        );

    };


    // =====================================
    // VIEW REVIEW
    // =====================================

    const viewReview = (review) => {

        alert(
            `Reviewer: ${review.reviewer?.name || "—"}\n` +
            `Reviewed User: ${review.reviewedUser?.name || "—"}\n` +
            `Rating: ${review.rating}/5\n` +
            `Comment: ${review.comment || "No comment"}\n` +
            `Swap Status: ${review.swapRequest?.status || "—"}`
        );

    };


    // =====================================
    // VIEW REPORT
    // =====================================

    const viewReport = (report) => {

        alert(
            `Reporter: ${report.reporter?.name || "—"}\n` +
            `Reported User: ${report.reportedUser?.name || "—"}\n` +
            `Listing: ${report.listing?.title || "—"}\n` +
            `Reason: ${report.reason || "—"}\n` +
            `Status: ${report.status}`
        );

    };


    return (

        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}

            <div className="bg-gray-900 text-white p-6">

                <div className="max-w-7xl mx-auto">

                    <h1 className="text-3xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-300 mt-1">
                        ReWear Marketplace Management
                    </p>

                </div>

            </div>


            {/* NAVIGATION */}

            <div className="bg-white shadow">

                <div className="max-w-7xl mx-auto flex flex-wrap gap-2 p-4">

                    {[
                        "overview",
                        "users",
                        "listings",
                        "swaps",
                        "reviews",
                        "reports"
                    ].map(tab => (

                        <button
                            key={tab}
                            onClick={() => {

                                setActiveTab(tab);

                                clearFilters();

                            }}
                            className={
                                `px-4 py-2 rounded-lg font-medium ${
                                    activeTab === tab
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`
                            }
                        >
                            {tab.toUpperCase()}
                        </button>

                    ))}

                </div>

            </div>


            <div className="max-w-7xl mx-auto p-6">


                {/* ================================= */}
                {/* OVERVIEW */}
                {/* ================================= */}

                {activeTab === "overview" && (

                    overview ? (

                        <div>

                            <h2 className="text-2xl font-bold mb-6">
                                Platform Overview
                            </h2>


                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                <StatCard
                                    title="Total Users"
                                    value={overview.users.total}
                                />

                                <StatCard
                                    title="Total Listings"
                                    value={overview.listings.total}
                                />

                                <StatCard
                                    title="Total Swaps"
                                    value={overview.swaps.total}
                                />

                                <StatCard
                                    title="Total Reviews"
                                    value={overview.reviews.total}
                                />

                                <StatCard
                                    title="Available Listings"
                                    value={overview.listings.available}
                                />

                                <StatCard
                                    title="Swapped Listings"
                                    value={overview.listings.swapped}
                                />

                                <StatCard
                                    title="Completed Swaps"
                                    value={overview.swaps.completed}
                                />

                                <StatCard
                                    title="Average Rating"
                                    value={`⭐ ${overview.reviews.averageRating}`}
                                />

                            </div>


                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

                                <InfoCard
                                    title="Admins"
                                    value={overview.users.admins}
                                />

                                <InfoCard
                                    title="Pending Swaps"
                                    value={overview.swaps.pending}
                                />

                                <InfoCard
                                    title="Pending Reports"
                                    value={overview.reports.pending}
                                />

                            </div>


                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

                                <InfoCard
                                    title="Accepted Swaps"
                                    value={overview.swaps.accepted}
                                />

                                <InfoCard
                                    title="Resolved Reports"
                                    value={overview.reports.resolved}
                                />

                                <InfoCard
                                    title="Normal Users"
                                    value={overview.users.normalUsers}
                                />

                            </div>

                        </div>

                    ) : (

                        <LoadingMessage />

                    )

                )}


                {/* ================================= */}
                {/* FILTER BAR */}
                {/* ================================= */}

                {activeTab !== "overview" && (

                    <div className="bg-white rounded-xl shadow p-4 mb-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">


                            {/* SEARCH */}

                            <input
                                value={search}
                                onChange={e =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search..."
                                className="border rounded-lg px-3 py-2"
                            />


                            {/* USER ROLE */}

                            {activeTab === "users" && (

                                <select
                                    value={role}
                                    onChange={e =>
                                        setRole(e.target.value)
                                    }
                                    className="border rounded-lg px-3 py-2"
                                >

                                    <option value="">
                                        All Roles
                                    </option>

                                    <option value="user">
                                        User
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                </select>

                            )}


                            {/* RATING */}

                            {activeTab === "reviews" && (

                                <select
                                    value={rating}
                                    onChange={e =>
                                        setRating(e.target.value)
                                    }
                                    className="border rounded-lg px-3 py-2"
                                >

                                    <option value="">
                                        All Ratings
                                    </option>

                                    <option value="5">
                                        ⭐ 5
                                    </option>

                                    <option value="4">
                                        ⭐ 4
                                    </option>

                                    <option value="3">
                                        ⭐ 3
                                    </option>

                                    <option value="2">
                                        ⭐ 2
                                    </option>

                                    <option value="1">
                                        ⭐ 1
                                    </option>

                                </select>

                            )}


                            {/* STATUS */}

                            {(
                                activeTab === "listings" ||
                                activeTab === "swaps" ||
                                activeTab === "reports"
                            ) && (

                                <select
                                    value={status}
                                    onChange={e =>
                                        setStatus(e.target.value)
                                    }
                                    className="border rounded-lg px-3 py-2"
                                >

                                    <option value="">
                                        All Status
                                    </option>


                                    {activeTab === "listings" && (
                                        <>
                                            <option value="available">
                                                Available
                                            </option>

                                            <option value="swapped">
                                                Swapped
                                            </option>
                                        </>
                                    )}


                                    {activeTab === "swaps" && (
                                        <>
                                            <option value="pending">
                                                Pending
                                            </option>

                                            <option value="accepted">
                                                Accepted
                                            </option>

                                            <option value="rejected">
                                                Rejected
                                            </option>

                                            <option value="cancelled">
                                                Cancelled
                                            </option>

                                            <option value="completed">
                                                Completed
                                            </option>
                                        </>
                                    )}


                                    {activeTab === "reports" && (
                                        <>
                                            <option value="pending">
                                                Pending
                                            </option>

                                            <option value="reviewed">
                                                Reviewed
                                            </option>

                                            <option value="resolved">
                                                Resolved
                                            </option>
                                        </>
                                    )}

                                </select>

                            )}


                            {/* SORT */}

                            <select
                                value={sortBy}
                                onChange={e =>
                                    setSortBy(e.target.value)
                                }
                                className="border rounded-lg px-3 py-2"
                            >

                                <option value="createdAt">
                                    Created Date
                                </option>


                                {activeTab === "users" && (
                                    <>
                                        <option value="name">
                                            Name
                                        </option>

                                        <option value="email">
                                            Email
                                        </option>

                                        <option value="location">
                                            Location
                                        </option>

                                        <option value="role">
                                            Role
                                        </option>
                                    </>
                                )}


                                {activeTab === "listings" && (
                                    <>
                                        <option value="title">
                                            Title
                                        </option>

                                        <option value="category">
                                            Category
                                        </option>

                                        <option value="brand">
                                            Brand
                                        </option>

                                        <option value="swapValue">
                                            Swap Value
                                        </option>

                                        <option value="location">
                                            Location
                                        </option>

                                        <option value="status">
                                            Status
                                        </option>
                                    </>
                                )}


                                {activeTab === "reviews" && (
                                    <option value="rating">
                                        Rating
                                    </option>
                                )}


                                {activeTab === "swaps" && (
                                    <>
                                        <option value="status">
                                            Status
                                        </option>

                                        <option value="deliveryMethod">
                                            Delivery Method
                                        </option>

                                        <option value="courierStatus">
                                            Courier Status
                                        </option>
                                    </>
                                )}


                                {activeTab === "reports" && (
                                    <>
                                        <option value="reason">
                                            Reason
                                        </option>

                                        <option value="status">
                                            Status
                                        </option>
                                    </>
                                )}

                            </select>


                            {/* ORDER */}

                            <button
                                onClick={() =>
                                    setOrder(
                                        order === "desc"
                                            ? "asc"
                                            : "desc"
                                    )
                                }
                                className="bg-gray-900 text-white rounded-lg px-3 py-2"
                            >
                                {order === "desc"
                                    ? "↓ Newest / Highest"
                                    : "↑ Oldest / Lowest"}
                            </button>

                        </div>


                        <button
                            onClick={clearFilters}
                            className="mt-3 text-sm underline"
                        >
                            Clear Filters
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* LOADING */}
                {/* ================================= */}

                {loading && activeTab !== "overview" && (

                    <div className="bg-white rounded-xl shadow p-6 mb-6 text-center text-gray-500">

                        Loading...

                    </div>

                )}


                {/* ================================= */}
                {/* USERS */}
                {/* ================================= */}

                {activeTab === "users" && !loading && (

                    <TableWrapper title="Users">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="p-3 text-left">
                                    Name
                                </th>

                                <th className="p-3 text-left">
                                    Email
                                </th>

                                <th className="p-3 text-left">
                                    Location
                                </th>

                                <th className="p-3 text-left">
                                    Role
                                </th>

                                <th className="p-3 text-left">
                                    Created
                                </th>

                                <th className="p-3 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.length === 0 ? (

                                <EmptyRow
                                    colSpan="6"
                                    message="No users found."
                                />

                            ) : (

                                users.map(user => (

                                    <tr
                                        key={user._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3 font-medium">
                                            {user.name}
                                        </td>

                                        <td className="p-3">
                                            {user.email}
                                        </td>

                                        <td className="p-3">
                                            {user.location}
                                        </td>

                                        <td className="p-3">

                                            <select
                                                value={user.role}
                                                onChange={e =>
                                                    changeRole(
                                                        user._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            >

                                                <option value="user">
                                                    User
                                                </option>

                                                <option value="admin">
                                                    Admin
                                                </option>

                                            </select>

                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {formatDate(
                                                user.createdAt
                                            )}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">

                                            <button
                                                onClick={() =>
                                                    viewUser(user)
                                                }
                                                className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteUser(
                                                        user._id
                                                    )
                                                }
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </TableWrapper>

                )}


                {/* ================================= */}
                {/* LISTINGS */}
                {/* ================================= */}

                {activeTab === "listings" && !loading && (

                    <TableWrapper title="Listings">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="p-3 text-left">
                                    Title
                                </th>

                                <th className="p-3 text-left">
                                    Category
                                </th>

                                <th className="p-3 text-left">
                                    Brand
                                </th>

                                <th className="p-3 text-left">
                                    Owner
                                </th>

                                <th className="p-3 text-left">
                                    Location
                                </th>

                                <th className="p-3 text-left">
                                    Value
                                </th>

                                <th className="p-3 text-left">
                                    Status
                                </th>

                                <th className="p-3 text-left">
                                    Created
                                </th>

                                <th className="p-3 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {listings.length === 0 ? (

                                <EmptyRow
                                    colSpan="9"
                                    message="No listings found."
                                />

                            ) : (

                                listings.map(listing => (

                                    <tr
                                        key={listing._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3 font-semibold">
                                            {listing.title}
                                        </td>

                                        <td className="p-3">
                                            {listing.category}
                                        </td>

                                        <td className="p-3">
                                            {listing.brand}
                                        </td>

                                        <td className="p-3">
                                            {listing.owner?.name || "—"}
                                        </td>

                                        <td className="p-3">
                                            {listing.location}
                                        </td>

                                        <td className="p-3">
                                            {listing.swapValue}
                                        </td>

                                        <td className="p-3">
                                            <StatusBadge
                                                value={listing.status}
                                            />
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {formatDate(
                                                listing.createdAt
                                            )}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">

                                            <button
                                                onClick={() =>
                                                    viewListing(
                                                        listing
                                                    )
                                                }
                                                className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteListing(
                                                        listing._id
                                                    )
                                                }
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </TableWrapper>

                )}


                {/* ================================= */}
                {/* SWAPS */}
                {/* ================================= */}

                {activeTab === "swaps" && !loading && (

                    <TableWrapper title="Swap Requests">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="p-3 text-left">
                                    Requester
                                </th>

                                <th className="p-3 text-left">
                                    Requested Item
                                </th>

                                <th className="p-3 text-left">
                                    Offered Item
                                </th>

                                <th className="p-3 text-left">
                                    Status
                                </th>

                                <th className="p-3 text-left">
                                    Delivery
                                </th>

                                <th className="p-3 text-left">
                                    Courier
                                </th>

                                <th className="p-3 text-left">
                                    Created
                                </th>

                                <th className="p-3 text-left">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {swaps.length === 0 ? (

                                <EmptyRow
                                    colSpan="8"
                                    message="No swap requests found."
                                />

                            ) : (

                                swaps.map(swap => (

                                    <tr
                                        key={swap._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3 font-medium">
                                            {swap.requester?.name || "—"}
                                        </td>

                                        <td className="p-3">
                                            {swap.listing?.title || "—"}
                                        </td>

                                        <td className="p-3">
                                            {swap.offeredListing?.title || "—"}
                                        </td>

                                        <td className="p-3">
                                            <StatusBadge
                                                value={swap.status}
                                            />
                                        </td>

                                        <td className="p-3">
                                            {swap.deliveryMethod || "—"}
                                        </td>

                                        <td className="p-3">
                                            <StatusBadge
                                                value={swap.courierStatus}
                                            />
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {formatDate(
                                                swap.createdAt
                                            )}
                                        </td>

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    viewSwap(swap)
                                                }
                                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </TableWrapper>

                )}


                {/* ================================= */}
                {/* REVIEWS */}
                {/* ================================= */}

                {activeTab === "reviews" && !loading && (

                    <TableWrapper title="Reviews">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="p-3 text-left">
                                    Reviewer
                                </th>

                                <th className="p-3 text-left">
                                    Reviewed User
                                </th>

                                <th className="p-3 text-left">
                                    Rating
                                </th>

                                <th className="p-3 text-left">
                                    Comment
                                </th>

                                <th className="p-3 text-left">
                                    Created
                                </th>

                                <th className="p-3 text-left">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {reviews.length === 0 ? (

                                <EmptyRow
                                    colSpan="6"
                                    message="No reviews found."
                                />

                            ) : (

                                reviews.map(review => (

                                    <tr
                                        key={review._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3">
                                            {review.reviewer?.name || "—"}
                                        </td>

                                        <td className="p-3">
                                            {review.reviewedUser?.name || "—"}
                                        </td>

                                        <td className="p-3">
                                            {"⭐".repeat(
                                                review.rating
                                            )}
                                        </td>

                                        <td className="p-3 max-w-xs">
                                            {review.comment || "No comment"}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {formatDate(
                                                review.createdAt
                                            )}
                                        </td>

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    viewReview(
                                                        review
                                                    )
                                                }
                                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </TableWrapper>

                )}


                {/* ================================= */}
                {/* REPORTS */}
                {/* ================================= */}

                {activeTab === "reports" && !loading && (

                    <TableWrapper title="Reports">

                        <thead>

                            <tr className="bg-gray-50">

                                <th className="p-3 text-left">
                                    Reporter
                                </th>

                                <th className="p-3 text-left">
                                    Reported User
                                </th>

                                <th className="p-3 text-left">
                                    Listing
                                </th>

                                <th className="p-3 text-left">
                                    Reason
                                </th>

                                <th className="p-3 text-left">
                                    Status
                                </th>

                                <th className="p-3 text-left">
                                    Created
                                </th>

                                <th className="p-3 text-left">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {reports.length === 0 ? (

                                <EmptyRow
                                    colSpan="7"
                                    message="No reports found."
                                />

                            ) : (

                                reports.map(report => (

                                    <tr
                                        key={report._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3">
                                            {report.reporter?.name || "—"}
                                        </td>

                                        <td className="p-3">
                                            {report.reportedUser?.name || "—"}
                                        </td>

                                        <td className="p-3">
                                            {report.listing?.title || "—"}
                                        </td>

                                        <td className="p-3">
                                            {report.reason || "—"}
                                        </td>

                                        <td className="p-3">

                                            <select
                                                value={report.status}
                                                onChange={e =>
                                                    updateReport(
                                                        report._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            >

                                                <option value="pending">
                                                    Pending
                                                </option>

                                                <option value="reviewed">
                                                    Reviewed
                                                </option>

                                                <option value="resolved">
                                                    Resolved
                                                </option>

                                            </select>

                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {formatDate(
                                                report.createdAt
                                            )}
                                        </td>

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    viewReport(
                                                        report
                                                    )
                                                }
                                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </TableWrapper>

                )}

            </div>

        </div>
    );
}


// =====================================
// STAT CARD
// =====================================

function StatCard({
    title,
    value
}) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500">
                {title}
            </p>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>

        </div>
    );
}


// =====================================
// INFO CARD
// =====================================

function InfoCard({
    title,
    value
}) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500">
                {title}
            </p>

            <p className="text-2xl font-bold mt-2">
                {value}
            </p>

        </div>
    );
}


// =====================================
// STATUS BADGE
// =====================================

function StatusBadge({
    value
}) {

    if (!value) {
        return <span>—</span>;
    }

    return (

        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">

            {value}

        </span>
    );
}


// =====================================
// EMPTY TABLE ROW
// =====================================

function EmptyRow({
    colSpan,
    message
}) {

    return (

        <tr>

            <td
                colSpan={colSpan}
                className="p-8 text-center text-gray-500"
            >
                {message}
            </td>

        </tr>
    );
}


// =====================================
// LOADING MESSAGE
// =====================================

function LoadingMessage() {

    return (

        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">

            Loading admin dashboard...

        </div>
    );
}


// =====================================
// TABLE WRAPPER
// =====================================

function TableWrapper({
    title,
    children
}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="p-5 border-b">

                <h2 className="text-xl font-bold">
                    {title}
                </h2>

            </div>


            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    {children}

                </table>

            </div>

        </div>
    );
}


// =====================================
// DATE/TIME
// =====================================

function formatDate(date) {

    if (!date)
        return "—";

    return new Date(date).toLocaleString();
}


export default AdminDashboard;