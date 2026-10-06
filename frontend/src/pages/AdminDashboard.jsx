import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import getImageUrl, {
  getImageUrls
} from "../utils/imageUrl";


const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


function AdminDashboard() {

  const navigate = useNavigate();

  // =====================================================
  // MAIN STATE
  // =====================================================

  const [activeTab, setActiveTab] =
    useState("overview");

  const [overview, setOverview] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [listings, setListings] =
    useState([]);

  const [swaps, setSwaps] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");


  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [role, setRole] =
    useState("");

  const [rating, setRating] =
    useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [order, setOrder] =
    useState("desc");


  // =====================================================
  // DETAIL MODAL
  // =====================================================

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [detailType, setDetailType] =
    useState("");


  // =====================================================
  // REPORT CENTER
  // =====================================================

  const [showReportGenerator, setShowReportGenerator] =
    useState(false);

  const [showGeneratedReport, setShowGeneratedReport] =
    useState(false);

  const [reportType, setReportType] =
    useState("platform");

  const [reportFrom, setReportFrom] =
    useState("");

  const [reportTo, setReportTo] =
    useState("");

  const [analyticsLoaded, setAnalyticsLoaded] =
    useState(false);

  const [analyticsLoading, setAnalyticsLoading] =
    useState(false);


  const token =
    localStorage.getItem("token");


  const headers = {
    Authorization:
      `Bearer ${token}`
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (recordOrDate) => {

    let date = null;

    if (
      typeof recordOrDate ===
      "object" &&
      recordOrDate !== null
    ) {

      if (recordOrDate.createdAt) {
        date =
          new Date(
            recordOrDate.createdAt
          );
      }

      // Old MongoDB documents may not have createdAt.
      // MongoDB ObjectId contains creation timestamp.
      if (
        !date &&
        recordOrDate._id &&
        /^[0-9a-fA-F]{24}$/.test(
          recordOrDate._id
        )
      ) {

        const seconds =
          parseInt(
            recordOrDate._id.substring(
              0,
              8
            ),
            16
          );

        date =
          new Date(
            seconds * 1000
          );

      }

    } else if (recordOrDate) {

      date =
        new Date(
          recordOrDate
        );

    }


    if (
      !date ||
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "—";

    }


    return date.toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  };


  // =====================================================
  // GET RECORD DATE
  // =====================================================

  const getRecordDate = (record) => {

    if (
      record?.createdAt
    ) {

      const date =
        new Date(
          record.createdAt
        );

      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        return date;

      }

    }


    if (
      record?._id &&
      /^[0-9a-fA-F]{24}$/.test(
        record._id
      )
    ) {

      const seconds =
        parseInt(
          record._id.substring(
            0,
            8
          ),
          16
        );

      return new Date(
        seconds * 1000
      );

    }


    return null;

  };


  // =====================================================
  // LOAD OVERVIEW
  // =====================================================

  const loadOverview = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const response =
        await axios.get(
          `${API}/admin/overview`,
          {
            headers
          }
        );

      setOverview(
        response.data
      );

    } catch (error) {

      console.log(
        "Overview error:",
        error
      );

      setErrorMessage(
        "Unable to load the admin overview."
      );

      if (
        error.response?.status ===
          401 ||
        error.response?.status ===
          403
      ) {

        navigate("/");

      }

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const params =
        new URLSearchParams();


      if (search) {
        params.append(
          "search",
          search
        );
      }


      if (role) {
        params.append(
          "role",
          role
        );
      }


      params.append(
        "sortBy",
        sortBy
      );


      params.append(
        "order",
        order
      );


      const response =
        await axios.get(
          `${API}/admin/users?${params.toString()}`,
          {
            headers
          }
        );


      setUsers(
        response.data.users ||
        []
      );


    } catch (error) {

      console.log(
        "Users error:",
        error
      );

      setErrorMessage(
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD LISTINGS
  // =====================================================

  const loadListings = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const params =
        new URLSearchParams();


      if (search) {
        params.append(
          "search",
          search
        );
      }


      if (status) {
        params.append(
          "status",
          status
        );
      }


      params.append(
        "sortBy",
        sortBy
      );


      params.append(
        "order",
        order
      );


      const response =
        await axios.get(
          `${API}/admin/listings?${params.toString()}`,
          {
            headers
          }
        );


      setListings(
        response.data.listings ||
        []
      );


    } catch (error) {

      console.log(
        "Listings error:",
        error
      );

      setErrorMessage(
        "Unable to load listings."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD SWAPS
  // =====================================================

  const loadSwaps = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const params =
        new URLSearchParams();


      if (status) {
        params.append(
          "status",
          status
        );
      }


      params.append(
        "sortBy",
        sortBy
      );


      params.append(
        "order",
        order
      );


      const response =
        await axios.get(
          `${API}/admin/swaps?${params.toString()}`,
          {
            headers
          }
        );


      setSwaps(
        response.data.swaps ||
        []
      );


    } catch (error) {

      console.log(
        "Swaps error:",
        error
      );

      setErrorMessage(
        "Unable to load swaps."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  const loadReviews = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const params =
        new URLSearchParams();


      if (search) {
        params.append(
          "search",
          search
        );
      }


      if (rating) {
        params.append(
          "rating",
          rating
        );
      }


      params.append(
        "sortBy",
        "createdAt"
      );


      params.append(
        "order",
        order
      );


      const response =
        await axios.get(
          `${API}/admin/reviews?${params.toString()}`,
          {
            headers
          }
        );


      setReviews(
        response.data.reviews ||
        []
      );


    } catch (error) {

      console.log(
        "Reviews error:",
        error
      );

      setErrorMessage(
        "Unable to load reviews."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD MODERATION REPORTS
  // =====================================================

  const loadReports = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const params =
        new URLSearchParams();


      if (search) {
        params.append(
          "search",
          search
        );
      }


      if (status) {
        params.append(
          "status",
          status
        );
      }


      params.append(
        "sortBy",
        "createdAt"
      );


      params.append(
        "order",
        order
      );


      const response =
        await axios.get(
          `${API}/admin/reports?${params.toString()}`,
          {
            headers
          }
        );


      setReports(
        response.data.reports ||
        []
      );


    } catch (error) {

      console.log(
        "Reports error:",
        error
      );

      setErrorMessage(
        "Unable to load reports."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD DATA FOR REPORT GENERATOR
  // =====================================================

  const loadAnalyticsData = async () => {

    try {

      setAnalyticsLoading(
        true
      );

      const [
        overviewResponse,
        usersResponse,
        listingsResponse,
        swapsResponse,
        reviewsResponse,
        reportsResponse
      ] =
        await Promise.all([

          axios.get(
            `${API}/admin/overview`,
            {
              headers
            }
          ),

          axios.get(
            `${API}/admin/users?sortBy=createdAt&order=desc`,
            {
              headers
            }
          ),

          axios.get(
            `${API}/admin/listings?sortBy=createdAt&order=desc`,
            {
              headers
            }
          ),

          axios.get(
            `${API}/admin/swaps?sortBy=createdAt&order=desc`,
            {
              headers
            }
          ),

          axios.get(
            `${API}/admin/reviews?sortBy=createdAt&order=desc`,
            {
              headers
            }
          ),

          axios.get(
            `${API}/admin/reports?sortBy=createdAt&order=desc`,
            {
              headers
            }
          )

        ]);


      setOverview(
        overviewResponse.data
      );


      setUsers(
        usersResponse.data.users ||
        []
      );


      setListings(
        listingsResponse.data.listings ||
        []
      );


      setSwaps(
        swapsResponse.data.swaps ||
        []
      );


      setReviews(
        reviewsResponse.data.reviews ||
        []
      );


      setReports(
        reportsResponse.data.reports ||
        []
      );


      setAnalyticsLoaded(
        true
      );


    } catch (error) {

      console.log(
        "Analytics data error:",
        error
      );

      setErrorMessage(
        "Unable to load report data."
      );

    } finally {

      setAnalyticsLoading(
        false
      );

    }

  };


  // =====================================================
  // LOAD ACTIVE TAB
  // =====================================================

  useEffect(() => {

    if (!token) {

      navigate("/login");

      return;

    }


    if (
      activeTab ===
      "overview"
    ) {

      loadOverview();

    }


    if (
      activeTab ===
      "users"
    ) {

      loadUsers();

    }


    if (
      activeTab ===
      "listings"
    ) {

      loadListings();

    }


    if (
      activeTab ===
      "swaps"
    ) {

      loadSwaps();

    }


    if (
      activeTab ===
      "reviews"
    ) {

      loadReviews();

    }


    if (
      activeTab ===
      "reports"
    ) {

      loadReports();

    }

  }, [
    activeTab,
    search,
    status,
    role,
    rating,
    sortBy,
    order
  ]);


  // =====================================================
  // CHANGE ROLE
  // =====================================================

  const changeRole = async (
    userId,
    newRole
  ) => {

    try {

      await axios.put(
        `${API}/admin/users/${userId}/role`,
        {
          role: newRole
        },
        {
          headers
        }
      );

      setUsers(
        previous =>
          previous.map(
            user =>
              user._id ===
              userId
                ? {
                    ...user,
                    role: newRole
                  }
                : user
          )
      );


    } catch (error) {

      console.log(
        "Role update error:",
        error
      );

      setErrorMessage(
        "Unable to update the user role."
      );

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const deleteUser = async (
    userId
  ) => {

    const confirmed =
      window.confirm(
        "Delete this user?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await axios.delete(
        `${API}/admin/users/${userId}`,
        {
          headers
        }
      );


      setUsers(
        previous =>
          previous.filter(
            user =>
              user._id !==
              userId
          )
      );


    } catch (error) {

      console.log(
        "Delete user error:",
        error
      );

      setErrorMessage(
        "Unable to delete the user."
      );

    }

  };


  // =====================================================
  // DELETE LISTING
  // =====================================================

  const deleteListing = async (
    listingId
  ) => {

    const confirmed =
      window.confirm(
        "Delete this listing?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await axios.delete(
        `${API}/admin/listings/${listingId}`,
        {
          headers
        }
      );


      setListings(
        previous =>
          previous.filter(
            listing =>
              listing._id !==
              listingId
          )
      );


    } catch (error) {

      console.log(
        "Delete listing error:",
        error
      );

      setErrorMessage(
        "Unable to delete the listing."
      );

    }

  };


  // =====================================================
  // UPDATE MODERATION REPORT
  // =====================================================

  const updateReport = async (
    reportId,
    newStatus
  ) => {

    try {

      await axios.put(
        `${API}/admin/reports/${reportId}`,
        {
          status:
            newStatus
        },
        {
          headers
        }
      );


      setReports(
        previous =>
          previous.map(
            report =>
              report._id ===
              reportId
                ? {
                    ...report,
                    status:
                      newStatus
                  }
                : report
          )
      );


    } catch (error) {

      console.log(
        "Update report error:",
        error
      );

      setErrorMessage(
        "Unable to update the report."
      );

    }

  };


  // =====================================================
  // OPEN DETAIL MODAL
  // =====================================================

  const openDetails = (
    type,
    record
  ) => {

    setDetailType(
      type
    );

    setSelectedRecord(
      record
    );

  };


  // =====================================================
  // CLOSE DETAIL MODAL
  // =====================================================

  const closeDetails = () => {

    setSelectedRecord(
      null
    );

    setDetailType(
      ""
    );

  };


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");
    setStatus("");
    setRole("");
    setRating("");
    setSortBy("createdAt");
    setOrder("desc");

  };


  // =====================================================
  // OPEN REPORT CENTER
  // =====================================================

  const openReportCenter =
    async () => {

      setShowReportGenerator(
        true
      );


      if (
        !analyticsLoaded
      ) {

        await loadAnalyticsData();

      }

    };


  // =====================================================
  // QUICK DATE RANGES
  // =====================================================

  const setQuickDateRange = (
    range
  ) => {

    const today =
      new Date();

    const toDate =
      today
        .toISOString()
        .split("T")[0];


    if (
      range ===
      "all"
    ) {

      setReportFrom("");
      setReportTo("");

      return;

    }


    if (
      range ===
      "today"
    ) {

      setReportFrom(
        toDate
      );

      setReportTo(
        toDate
      );

      return;

    }


    if (
      range ===
      "7"
    ) {

      const from =
        new Date(
          today
        );

      from.setDate(
        from.getDate() - 6
      );


      setReportFrom(
        from
          .toISOString()
          .split("T")[0]
      );

      setReportTo(
        toDate
      );

      return;

    }


    if (
      range ===
      "30"
    ) {

      const from =
        new Date(
          today
        );

      from.setDate(
        from.getDate() - 29
      );


      setReportFrom(
        from
          .toISOString()
          .split("T")[0]
      );

      setReportTo(
        toDate
      );

    }

  };


  // =====================================================
  // DATE FILTER
  // =====================================================

  const filterByReportDate =
    (items) => {

      return items.filter(
        item => {

          const date =
            getRecordDate(
              item
            );


          if (!date) {
            return false;
          }


          const dateOnly =
            date
              .toISOString()
              .split("T")[0];


          if (
            reportFrom &&
            dateOnly <
              reportFrom
          ) {

            return false;

          }


          if (
            reportTo &&
            dateOnly >
              reportTo
          ) {

            return false;

          }


          return true;

        }
      );

    };


  // =====================================================
  // REPORT DATA
  // =====================================================

  const reportData =
    useMemo(() => {

      const filteredUsers =
        filterByReportDate(
          users
        );

      const filteredListings =
        filterByReportDate(
          listings
        );

      const filteredSwaps =
        filterByReportDate(
          swaps
        );

      const filteredReviews =
        filterByReportDate(
          reviews
        );

      const filteredReports =
        filterByReportDate(
          reports
        );


      const averageRating =
        filteredReviews.length
          ? (
              filteredReviews.reduce(
                (
                  total,
                  review
                ) =>
                  total +
                  Number(
                    review.rating ||
                    0
                  ),
                0
              ) /
              filteredReviews.length
            ).toFixed(1)
          : "0.0";


      const totalSwapValue =
        filteredListings.reduce(
          (
            total,
            listing
          ) =>
            total +
            Number(
              listing.swapValue ||
              0
            ),
          0
        );


      return {

        users:
          filteredUsers,

        listings:
          filteredListings,

        swaps:
          filteredSwaps,

        reviews:
          filteredReviews,

        reports:
          filteredReports,

        summary: {

          totalUsers:
            filteredUsers.length,

          admins:
            filteredUsers.filter(
              user =>
                user.role ===
                "admin"
            ).length,

          normalUsers:
            filteredUsers.filter(
              user =>
                user.role !==
                "admin"
            ).length,

          totalListings:
            filteredListings.length,

          availableListings:
            filteredListings.filter(
              listing =>
                listing.status ===
                "available"
            ).length,

          swappedListings:
            filteredListings.filter(
              listing =>
                listing.status ===
                "swapped"
            ).length,

          totalSwapValue,

          totalSwaps:
            filteredSwaps.length,

          pendingSwaps:
            filteredSwaps.filter(
              swap =>
                swap.status ===
                "pending"
            ).length,

          acceptedSwaps:
            filteredSwaps.filter(
              swap =>
                swap.status ===
                "accepted"
            ).length,

          completedSwaps:
            filteredSwaps.filter(
              swap =>
                swap.status ===
                "completed"
            ).length,

          rejectedSwaps:
            filteredSwaps.filter(
              swap =>
                swap.status ===
                "rejected"
            ).length,

          totalReviews:
            filteredReviews.length,

          averageRating,

          totalReports:
            filteredReports.length,

          pendingReports:
            filteredReports.filter(
              report =>
                report.status ===
                "pending"
            ).length,

          reviewedReports:
            filteredReports.filter(
              report =>
                report.status ===
                "reviewed"
            ).length,

          resolvedReports:
            filteredReports.filter(
              report =>
                report.status ===
                "resolved"
            ).length

        }

      };

    }, [
      users,
      listings,
      swaps,
      reviews,
      reports,
      reportFrom,
      reportTo
    ]);


  // =====================================================
  // REPORT TITLE
  // =====================================================

  const reportTitle = {

    platform:
      "Platform Summary Report",

    users:
      "User Activity Report",

    listings:
      "Listing Report",

    swaps:
      "Swap Activity Report",

    reviews:
      "Reviews Report",

    moderation:
      "Moderation Report"

  }[reportType];


  // =====================================================
  // REPORT PERIOD LABEL
  // =====================================================

  const reportPeriod =
    reportFrom ||
    reportTo
      ? `${reportFrom || "Beginning"} → ${reportTo || "Today"}`
      : "All available records";


  // =====================================================
  // REPORT TYPE CONTENT
  // =====================================================

  const renderReportContent =
    () => {

      const s =
        reportData.summary;


      if (
        reportType ===
        "platform"
      ) {

        return (

          <div className="grid md:grid-cols-2 gap-5">

            <ReportSection
              title="Users"
              rows={[
                ["Total Users", s.totalUsers],
                ["Admins", s.admins],
                ["Regular Users", s.normalUsers]
              ]}
            />

            <ReportSection
              title="Listings"
              rows={[
                ["Total Listings", s.totalListings],
                ["Available", s.availableListings],
                ["Swapped", s.swappedListings],
                [
                  "Total Swap Value",
                  s.totalSwapValue
                ]
              ]}
            />

            <ReportSection
              title="Swaps"
              rows={[
                ["Total Requests", s.totalSwaps],
                ["Pending", s.pendingSwaps],
                ["Accepted", s.acceptedSwaps],
                ["Completed", s.completedSwaps],
                ["Rejected", s.rejectedSwaps]
              ]}
            />

            <ReportSection
              title="Reviews"
              rows={[
                ["Total Reviews", s.totalReviews],
                ["Average Rating", `⭐ ${s.averageRating}/5`]
              ]}
            />

            <ReportSection
              title="Moderation"
              rows={[
                ["Total Reports", s.totalReports],
                ["Pending", s.pendingReports],
                ["Reviewed", s.reviewedReports],
                ["Resolved", s.resolvedReports]
              ]}
            />

          </div>

        );

      }


      if (
        reportType ===
        "users"
      ) {

        return (

          <ReportSection
            title="User Activity"
            rows={[
              ["Total Users", s.totalUsers],
              ["Admins", s.admins],
              ["Regular Users", s.normalUsers]
            ]}
          />

        );

      }


      if (
        reportType ===
        "listings"
      ) {

        const categoryCounts =
          {};

        reportData.listings.forEach(
          listing => {

            const category =
              listing.category ||
              "Other";

            categoryCounts[
              category
            ] =
              (
                categoryCounts[
                  category
                ] ||
                0
              ) + 1;

          }
        );


        return (

          <div className="space-y-5">

            <ReportSection
              title="Listing Summary"
              rows={[
                ["Total Listings", s.totalListings],
                ["Available", s.availableListings],
                ["Swapped", s.swappedListings],
                [
                  "Total Swap Value",
                  s.totalSwapValue
                ]
              ]}
            />

            <div className="bg-white rounded-2xl border border-stone-200 p-5">

              <h3 className="font-bold text-gray-900">
                Listings by Category
              </h3>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">

                {Object.entries(
                  categoryCounts
                ).map(
                  ([category, count]) => (

                    <div
                      key={category}
                      className="bg-stone-50 rounded-xl p-4"
                    >

                      <p className="text-sm text-gray-500">
                        {category}
                      </p>

                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {count}
                      </p>

                    </div>

                  )
                )}

                {Object.keys(
                  categoryCounts
                ).length === 0 && (

                  <p className="text-sm text-gray-500">
                    No listing data for this period.
                  </p>

                )}

              </div>

            </div>

          </div>

        );

      }


      if (
        reportType ===
        "swaps"
      ) {

        return (

          <ReportSection
            title="Swap Activity"
            rows={[
              ["Total Requests", s.totalSwaps],
              ["Pending", s.pendingSwaps],
              ["Accepted", s.acceptedSwaps],
              ["Completed", s.completedSwaps],
              ["Rejected", s.rejectedSwaps]
            ]}
          />

        );

      }


      if (
        reportType ===
        "reviews"
      ) {

        return (

          <ReportSection
            title="Review Summary"
            rows={[
              ["Total Reviews", s.totalReviews],
              ["Average Rating", `⭐ ${s.averageRating}/5`]
            ]}
          />

        );

      }


      if (
        reportType ===
        "moderation"
      ) {

        return (

          <ReportSection
            title="Moderation Summary"
            rows={[
              ["Total Reports", s.totalReports],
              ["Pending", s.pendingReports],
              ["Reviewed", s.reviewedReports],
              ["Resolved", s.resolvedReports]
            ]}
          />

        );

      }


      return null;

    };


  // =====================================================
  // TABLE DATA
  // =====================================================

  const visibleUsers =
    users;


  const visibleListings =
    listings;


  const visibleSwaps =
    swaps;


  const visibleReviews =
    reviews;


  const visibleReports =
    reports;


  return (

    <div className="min-h-screen bg-stone-50">

      {/* PRINT STYLE */}

      <style>
        {`
          @media print {

            body * {
              visibility: hidden !important;
            }

            .print-report,
            .print-report * {
              visibility: visible !important;
            }

            .print-report {
              position: absolute !important;
              inset: 0 !important;
              width: 100% !important;
              background: white !important;
              padding: 30px !important;
            }

          }
        `}
      </style>


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-gray-950 text-white">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-green-400 text-xs font-bold tracking-[0.25em] uppercase">
                ReWear Administration
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Admin Control Center
              </h1>

              <p className="text-gray-400 mt-2">
                Manage users, listings, swaps, reviews and platform reports.
              </p>

            </div>


            <div className="flex gap-3">

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
              >
                Dashboard
              </button>

            </div>

          </div>

        </div>

      </header>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="bg-white border-b border-stone-200 sticky top-0 z-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex gap-2 overflow-x-auto py-3">

            {[
              ["overview", "Overview"],
              ["users", "Users"],
              ["listings", "Listings"],
              ["swaps", "Swaps"],
              ["reviews", "Reviews"],
              ["reports", "Reports"]
            ].map(
              ([value, label]) => (

                <button
                  key={value}
                  onClick={() => {

                    setActiveTab(
                      value
                    );

                    clearFilters();

                    closeDetails();

                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === value
                      ? "bg-gray-950 text-white shadow"
                      : "text-gray-600 hover:bg-stone-100"
                  }`}
                >
                  {label}
                </button>

              )
            )}

          </div>

        </div>

      </div>


      <main className="max-w-7xl mx-auto px-6 py-8">


        {/* ERROR */}

        {errorMessage && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-start justify-between gap-4">

            <p className="text-sm text-red-700">
              {errorMessage}
            </p>

            <button
              onClick={() =>
                setErrorMessage("")
              }
              className="text-red-500 font-bold"
            >
              ×
            </button>

          </div>

        )}


        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab === "overview" && (

          overview ? (

            <div className="space-y-8">

              <div>

                <p className="text-sm text-green-700 font-bold uppercase tracking-widest">
                  Platform Overview
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  Everything at a glance
                </h2>

              </div>


              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <KpiCard
                  title="Users"
                  value={
                    overview.users?.total ||
                    0
                  }
                  subtitle="Registered accounts"
                  icon="👥"
                />

                <KpiCard
                  title="Listings"
                  value={
                    overview.listings?.total ||
                    0
                  }
                  subtitle="Clothing pieces"
                  icon="👕"
                />

                <KpiCard
                  title="Swap Requests"
                  value={
                    overview.swaps?.total ||
                    0
                  }
                  subtitle="All requests"
                  icon="🔄"
                />

                <KpiCard
                  title="Reviews"
                  value={
                    overview.reviews?.total ||
                    0
                  }
                  subtitle="Community feedback"
                  icon="⭐"
                />

                <KpiCard
                  title="Available"
                  value={
                    overview.listings?.available ||
                    0
                  }
                  subtitle="Currently listed"
                  icon="🟢"
                />

                <KpiCard
                  title="Completed Swaps"
                  value={
                    overview.swaps?.completed ||
                    0
                  }
                  subtitle="Successful exchanges"
                  icon="✅"
                />

                <KpiCard
                  title="Pending Reports"
                  value={
                    overview.reports?.pending ||
                    0
                  }
                  subtitle="Need moderation"
                  icon="🚩"
                />

                <KpiCard
                  title="Average Rating"
                  value={`${
                    overview.reviews?.averageRating ||
                    0
                  } / 5`}
                  subtitle="Community rating"
                  icon="★"
                />

              </div>


              <div className="grid lg:grid-cols-3 gap-5">

                <MiniStatCard
                  title="Admins"
                  value={
                    overview.users?.admins ||
                    0
                  }
                />

                <MiniStatCard
                  title="Pending Swaps"
                  value={
                    overview.swaps?.pending ||
                    0
                  }
                />

                <MiniStatCard
                  title="Resolved Reports"
                  value={
                    overview.reports?.resolved ||
                    0
                  }
                />

              </div>


              <div className="bg-gray-950 rounded-3xl p-7 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <p className="text-green-400 font-semibold text-sm">
                    REPORT CENTER
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    Generate a custom platform report
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Choose a report type and date range.
                  </p>

                </div>

                <button
                  onClick={openReportCenter}
                  className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-semibold transition"
                >
                  Open Report Center
                </button>

              </div>

            </div>

          ) : (

            <LoadingState />

          )

        )}


        {/* =================================================
            FILTER BAR
        ================================================= */}

        {activeTab !== "overview" && (

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-6">

            <div className="flex flex-col lg:flex-row lg:items-center gap-3">

              <div className="flex-1">

                <input
                  value={search}
                  onChange={
                    e =>
                      setSearch(
                        e.target.value
                      )
                  }
                  placeholder={
                    activeTab === "users"
                      ? "Search name, email or location..."
                      : "Search..."
                  }
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>


              {activeTab === "users" && (

                <select
                  value={role}
                  onChange={
                    e =>
                      setRole(
                        e.target.value
                      )
                  }
                  className="border border-stone-300 rounded-xl px-4 py-3 bg-white"
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


              {(
                activeTab ===
                  "listings" ||
                activeTab ===
                  "swaps" ||
                activeTab ===
                  "reports"
              ) && (

                <select
                  value={status}
                  onChange={
                    e =>
                      setStatus(
                        e.target.value
                      )
                  }
                  className="border border-stone-300 rounded-xl px-4 py-3 bg-white"
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

                      <option value="completed">
                        Completed
                      </option>

                      <option value="rejected">
                        Rejected
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


              {activeTab === "reviews" && (

                <select
                  value={rating}
                  onChange={
                    e =>
                      setRating(
                        e.target.value
                      )
                  }
                  className="border border-stone-300 rounded-xl px-4 py-3 bg-white"
                >

                  <option value="">
                    All Ratings
                  </option>

                  <option value="5">
                    ★★★★★
                  </option>

                  <option value="4">
                    ★★★★
                  </option>

                  <option value="3">
                    ★★★
                  </option>

                  <option value="2">
                    ★★
                  </option>

                  <option value="1">
                    ★
                  </option>

                </select>

              )}


              <select
                value={sortBy}
                onChange={
                  e =>
                    setSortBy(
                      e.target.value
                    )
                }
                className="border border-stone-300 rounded-xl px-4 py-3 bg-white"
              >

                <option value="createdAt">
                  Created Date
                </option>

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

                {activeTab === "reviews" && (
                  <option value="rating">
                    Rating
                  </option>
                )}

              </select>


              <button
                onClick={() =>
                  setOrder(
                    previous =>
                      previous ===
                      "desc"
                        ? "asc"
                        : "desc"
                  )
                }
                className="px-4 py-3 rounded-xl bg-gray-950 text-white font-semibold"
              >
                {order === "desc"
                  ? "↓ Newest"
                  : "↑ Oldest"}
              </button>


              <button
                onClick={
                  clearFilters
                }
                className="px-4 py-3 rounded-xl border border-stone-300 text-gray-700 hover:bg-stone-50"
              >
                Reset
              </button>

            </div>

          </div>

        )}


        {/* LOADING */}

        {loading &&
          activeTab !== "overview" && (

            <LoadingState />

          )}


        {/* =================================================
            USERS
        ================================================= */}

        {activeTab === "users" &&
          !loading && (

            <AdminTable
              title="Users"
              subtitle={`${visibleUsers.length} accounts`}
              columns={[
                "User",
                "Email",
                "Location",
                "Role",
                "Joined",
                "Actions"
              ]}
            >

              {visibleUsers.length ===
              0 ? (

                <EmptyRow
                  columns={6}
                  message="No users found."
                />

              ) : (

                visibleUsers.map(
                  user => (

                    <tr
                      key={
                        user._id
                      }
                      className="border-t border-stone-100 hover:bg-stone-50"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
                            {user.name
                              ?.charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID: {user._id}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="p-4 text-gray-600">
                        {user.email}
                      </td>


                      <td className="p-4 text-gray-600">
                        {user.location ||
                          "—"}
                      </td>


                      <td className="p-4">

                        <select
                          value={
                            user.role
                          }
                          onChange={
                            e =>
                              changeRole(
                                user._id,
                                e.target.value
                              )
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold border-0 ${
                            user.role ===
                            "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >

                          <option value="user">
                            User
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                        </select>

                      </td>


                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {formatDate(
                          user
                        )}
                      </td>


                      <td className="p-4">

                        <ActionButton
                          onClick={() =>
                            openDetails(
                              "user",
                              user
                            )
                          }
                        >
                          View
                        </ActionButton>

                        <DeleteButton
                          onClick={() =>
                            deleteUser(
                              user._id
                            )
                          }
                        >
                          Delete
                        </DeleteButton>

                      </td>

                    </tr>

                  )
                )

              )}

            </AdminTable>

          )}


        {/* =================================================
            LISTINGS
        ================================================= */}

        {activeTab === "listings" &&
          !loading && (

            <AdminTable
              title="Clothing Listings"
              subtitle={`${visibleListings.length} listings`}
              columns={[
                "Image",
                "Item",
                "Owner",
                "Location",
                "Value",
                "Status",
                "Created",
                "Actions"
              ]}
            >

              {visibleListings.length ===
              0 ? (

                <EmptyRow
                  columns={8}
                  message="No listings found."
                />

              ) : (

                visibleListings.map(
                  listing => (

                    <tr
                      key={
                        listing._id
                      }
                      className="border-t border-stone-100 hover:bg-stone-50"
                    >

                      <td className="p-4">

                        {listing.image ? (

                          <img
                            src={
                              getImageUrl(
                                listing.image
                              )
                            }
                            alt={
                              listing.title
                            }
                            className="w-16 h-16 rounded-xl bg-stone-100 object-contain border border-stone-200"
                          />

                        ) : (

                          <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-2xl">
                            👕
                          </div>

                        )}

                      </td>


                      <td className="p-4">

                        <div>

                          <p className="font-semibold text-gray-900">
                            {listing.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {listing.category}
                            {" · "}
                            {listing.brand}
                          </p>

                        </div>

                      </td>


                      <td className="p-4 text-gray-600">
                        {listing.owner?.name ||
                          "—"}
                      </td>


                      <td className="p-4 text-gray-600">
                        {listing.location ||
                          "—"}
                      </td>


                      <td className="p-4 font-bold text-green-700">
                        {listing.swapValue ||
                          0}
                      </td>


                      <td className="p-4">

                        <StatusBadge
                          value={
                            listing.status
                          }
                        />

                      </td>


                      <td className="p-4 whitespace-nowrap text-gray-500">
                        {formatDate(
                          listing
                        )}
                      </td>


                      <td className="p-4 whitespace-nowrap">

                        <ActionButton
                          onClick={() =>
                            openDetails(
                              "listing",
                              listing
                            )
                          }
                        >
                          View
                        </ActionButton>

                        <DeleteButton
                          onClick={() =>
                            deleteListing(
                              listing._id
                            )
                          }
                        >
                          Delete
                        </DeleteButton>

                      </td>

                    </tr>

                  )
                )

              )}

            </AdminTable>

          )}


        {/* =================================================
            SWAPS
        ================================================= */}

        {activeTab === "swaps" &&
          !loading && (

            <AdminTable
              title="Swap Requests"
              subtitle={`${visibleSwaps.length} requests`}
              columns={[
                "Requester",
                "Requested Item",
                "Offered Item",
                "Status",
                "Delivery",
                "Created",
                "Actions"
              ]}
            >

              {visibleSwaps.length ===
              0 ? (

                <EmptyRow
                  columns={7}
                  message="No swaps found."
                />

              ) : (

                visibleSwaps.map(
                  swap => (

                    <tr
                      key={
                        swap._id
                      }
                      className="border-t border-stone-100 hover:bg-stone-50"
                    >

                      <td className="p-4 font-semibold text-gray-900">
                        {swap.requester?.name ||
                          "—"}
                      </td>


                      <td className="p-4 text-gray-600">
                        {swap.listing?.title ||
                          "—"}
                      </td>


                      <td className="p-4 text-gray-600">
                        {swap.offeredListing?.title ||
                          "—"}
                      </td>


                      <td className="p-4">

                        <StatusBadge
                          value={
                            swap.status
                          }
                        />

                      </td>


                      <td className="p-4 text-gray-600">

                        {swap.deliveryMethod ||
                          "—"}

                      </td>


                      <td className="p-4 whitespace-nowrap text-gray-500">
                        {formatDate(
                          swap
                        )}
                      </td>


                      <td className="p-4">

                        <ActionButton
                          onClick={() =>
                            openDetails(
                              "swap",
                              swap
                            )
                          }
                        >
                          View
                        </ActionButton>

                      </td>

                    </tr>

                  )
                )

              )}

            </AdminTable>

          )}


        {/* =================================================
            REVIEWS
        ================================================= */}

        {activeTab === "reviews" &&
          !loading && (

            <AdminTable
              title="Community Reviews"
              subtitle={`${visibleReviews.length} reviews`}
              columns={[
                "Reviewer",
                "Reviewed User",
                "Rating",
                "Comment",
                "Created",
                "Actions"
              ]}
            >

              {visibleReviews.length ===
              0 ? (

                <EmptyRow
                  columns={6}
                  message="No reviews found."
                />

              ) : (

                visibleReviews.map(
                  review => (

                    <tr
                      key={
                        review._id
                      }
                      className="border-t border-stone-100 hover:bg-stone-50"
                    >

                      <td className="p-4 font-semibold text-gray-900">
                        {review.reviewer?.name ||
                          "—"}
                      </td>


                      <td className="p-4 text-gray-600">
                        {review.reviewedUser?.name ||
                          "—"}
                      </td>


                      <td className="p-4">

                        <div className="text-amber-500">
                          {"★".repeat(
                            Number(
                              review.rating ||
                              0
                            )
                          )}
                        </div>

                      </td>


                      <td className="p-4 max-w-xs">

                        <p className="truncate text-gray-600">
                          {review.comment ||
                            "No comment"}
                        </p>

                      </td>


                      <td className="p-4 whitespace-nowrap text-gray-500">
                        {formatDate(
                          review
                        )}
                      </td>


                      <td className="p-4">

                        <ActionButton
                          onClick={() =>
                            openDetails(
                              "review",
                              review
                            )
                          }
                        >
                          View
                        </ActionButton>

                      </td>

                    </tr>

                  )
                )

              )}

            </AdminTable>

          )}


        {/* =================================================
            MODERATION REPORTS
        ================================================= */}

        {activeTab === "reports" &&
          !loading && (

            <div className="space-y-6">

              <div className="bg-gray-950 text-white rounded-3xl p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                  <p className="text-green-400 text-xs font-bold tracking-[0.2em] uppercase">
                    Reports Center
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold mt-2">
                    Platform analytics & moderation
                  </h2>

                  <p className="text-gray-400 mt-2 max-w-2xl">
                    Generate custom reports by type and date range, or review user-submitted moderation reports.
                  </p>

                </div>

                <button
                  onClick={
                    openReportCenter
                  }
                  className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-semibold transition whitespace-nowrap"
                >
                  Generate Report
                </button>

              </div>


              <AdminTable
                title="Moderation Reports"
                subtitle={`${visibleReports.length} reports`}
                columns={[
                  "Reporter",
                  "Reported User",
                  "Listing",
                  "Reason",
                  "Status",
                  "Created",
                  "Actions"
                ]}
              >

                {visibleReports.length ===
                0 ? (

                  <EmptyRow
                    columns={7}
                    message="No moderation reports found."
                  />

                ) : (

                  visibleReports.map(
                    report => (

                      <tr
                        key={
                          report._id
                        }
                        className="border-t border-stone-100 hover:bg-stone-50"
                      >

                        <td className="p-4 font-semibold text-gray-900">
                          {report.reporter?.name ||
                            "—"}
                        </td>


                        <td className="p-4 text-gray-600">
                          {report.reportedUser?.name ||
                            "—"}
                        </td>


                        <td className="p-4 text-gray-600">
                          {report.listing?.title ||
                            "—"}
                        </td>


                        <td className="p-4 text-gray-600">
                          {report.reason ||
                            "—"}
                        </td>


                        <td className="p-4">

                          <select
                            value={
                              report.status
                            }
                            onChange={
                              e =>
                                updateReport(
                                  report._id,
                                  e.target.value
                                )
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold border-0 ${
                              report.status ===
                              "resolved"
                                ? "bg-green-100 text-green-700"
                                : report.status ===
                                  "reviewed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
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


                        <td className="p-4 whitespace-nowrap text-gray-500">
                          {formatDate(
                            report
                          )}
                        </td>


                        <td className="p-4">

                          <ActionButton
                            onClick={() =>
                              openDetails(
                                "report",
                                report
                              )
                            }
                          >
                            View
                          </ActionButton>

                        </td>

                      </tr>

                    )
                  )

                )}

              </AdminTable>

            </div>

          )}

      </main>


      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {selectedRecord && (

        <DetailModal
          type={
            detailType
          }
          record={
            selectedRecord
          }
          onClose={
            closeDetails
          }
        />

      )}


      {/* =================================================
          REPORT GENERATOR
      ================================================= */}

      {showReportGenerator && (

        <div className="fixed inset-0 z-50 bg-black/60 p-4 md:p-8 overflow-y-auto">

          <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

              <div className="bg-gray-950 text-white p-6 flex justify-between items-center">

                <div>

                  <p className="text-green-400 text-xs font-bold tracking-widest uppercase">
                    Report Center
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Generate a Report
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setShowReportGenerator(
                      false
                    )
                  }
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-xl"
                >
                  ×
                </button>

              </div>


              <div className="p-6">

                {analyticsLoading ? (

                  <div className="py-16 text-center text-gray-500">
                    Loading report data...
                  </div>

                ) : (

                  <>

                    {/* REPORT TYPE */}

                    <div className="grid md:grid-cols-2 gap-5">

                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Report Type
                        </label>

                        <select
                          value={
                            reportType
                          }
                          onChange={
                            e =>
                              setReportType(
                                e.target.value
                              )
                          }
                          className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white"
                        >

                          <option value="platform">
                            Platform Summary
                          </option>

                          <option value="users">
                            Users
                          </option>

                          <option value="listings">
                            Listings
                          </option>

                          <option value="swaps">
                            Swaps
                          </option>

                          <option value="reviews">
                            Reviews
                          </option>

                          <option value="moderation">
                            Moderation Reports
                          </option>

                        </select>

                      </div>


                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quick Period
                        </label>

                        <div className="flex flex-wrap gap-2">

                          <QuickButton
                            onClick={() =>
                              setQuickDateRange(
                                "today"
                              )
                            }
                          >
                            Today
                          </QuickButton>

                          <QuickButton
                            onClick={() =>
                              setQuickDateRange(
                                "7"
                              )
                            }
                          >
                            Last 7 days
                          </QuickButton>

                          <QuickButton
                            onClick={() =>
                              setQuickDateRange(
                                "30"
                              )
                            }
                          >
                            Last 30 days
                          </QuickButton>

                          <QuickButton
                            onClick={() =>
                              setQuickDateRange(
                                "all"
                              )
                            }
                          >
                            All time
                          </QuickButton>

                        </div>

                      </div>

                    </div>


                    {/* DATE RANGE */}

                    <div className="grid md:grid-cols-2 gap-5 mt-5">

                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          From
                        </label>

                        <input
                          type="date"
                          value={
                            reportFrom
                          }
                          onChange={
                            e =>
                              setReportFrom(
                                e.target.value
                              )
                          }
                          className="w-full border border-stone-300 rounded-xl px-4 py-3"
                        />

                      </div>


                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          To
                        </label>

                        <input
                          type="date"
                          value={
                            reportTo
                          }
                          onChange={
                            e =>
                              setReportTo(
                                e.target.value
                              )
                          }
                          className="w-full border border-stone-300 rounded-xl px-4 py-3"
                        />

                      </div>

                    </div>


                    {/* LIVE PREVIEW */}

                    <div className="mt-7 bg-stone-50 rounded-2xl p-5 border border-stone-200">

                      <div className="flex justify-between items-center">

                        <div>

                          <p className="text-xs uppercase tracking-widest text-green-700 font-bold">
                            Preview
                          </p>

                          <h3 className="text-xl font-bold text-gray-900 mt-1">
                            {reportTitle}
                          </h3>

                        </div>

                        <span className="text-xs text-gray-500">
                          {reportPeriod}
                        </span>

                      </div>


                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">

                        <PreviewMetric
                          label="Users"
                          value={
                            reportData.summary.totalUsers
                          }
                        />

                        <PreviewMetric
                          label="Listings"
                          value={
                            reportData.summary.totalListings
                          }
                        />

                        <PreviewMetric
                          label="Swaps"
                          value={
                            reportData.summary.totalSwaps
                          }
                        />

                        <PreviewMetric
                          label="Reviews"
                          value={
                            reportData.summary.totalReviews
                          }
                        />

                        <PreviewMetric
                          label="Reports"
                          value={
                            reportData.summary.totalReports
                          }
                        />

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7">

                      <button
                        onClick={() =>
                          setShowReportGenerator(
                            false
                          )
                        }
                        className="px-5 py-3 rounded-xl border border-stone-300 text-gray-700"
                      >
                        Cancel
                      </button>


                      <button
                        onClick={() => {

                          setShowReportGenerator(
                            false
                          );

                          setShowGeneratedReport(
                            true
                          );

                        }}
                        className="px-6 py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800"
                      >
                        Generate Report
                      </button>

                    </div>

                  </>

                )}

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          GENERATED REPORT
      ================================================= */}

      {showGeneratedReport && (

        <div className="fixed inset-0 z-[60] bg-black/60 p-4 md:p-8 overflow-y-auto">

          <div className="max-w-5xl mx-auto">

            <div className="print-report bg-white rounded-3xl shadow-2xl overflow-hidden">

              <div className="bg-gray-950 text-white p-7 flex justify-between items-start">

                <div>

                  <p className="text-green-400 text-xs font-bold tracking-widest uppercase">
                    ReWear Marketplace
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {reportTitle}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Period: {reportPeriod}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    Generated: {formatDate(new Date())}
                  </p>

                </div>


                <button
                  onClick={() =>
                    setShowGeneratedReport(
                      false
                    )
                  }
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-xl"
                >
                  ×
                </button>

              </div>


              <div className="p-7">

                {renderReportContent()}


                <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">

                  <ReportMetric
                    label="Users"
                    value={
                      reportData.summary.totalUsers
                    }
                  />

                  <ReportMetric
                    label="Listings"
                    value={
                      reportData.summary.totalListings
                    }
                  />

                  <ReportMetric
                    label="Swaps"
                    value={
                      reportData.summary.totalSwaps
                    }
                  />

                  <ReportMetric
                    label="Reviews"
                    value={
                      reportData.summary.totalReviews
                    }
                  />

                  <ReportMetric
                    label="Reports"
                    value={
                      reportData.summary.totalReports
                    }
                  />

                </div>


                <div className="mt-8 flex justify-end gap-3">

                  <button
                    onClick={() =>
                      window.print()
                    }
                    className="px-6 py-3 rounded-xl bg-gray-950 text-white font-semibold hover:bg-gray-800"
                  >
                    Print / Save PDF
                  </button>

                  <button
                    onClick={() =>
                      setShowGeneratedReport(
                        false
                      )
                    }
                    className="px-6 py-3 rounded-xl border border-stone-300 text-gray-700"
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


// =====================================================
// KPI CARD
// =====================================================

function KpiCard({
  title,
  value,
  subtitle,
  icon
}) {

  return (

    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-gray-950 mt-2">
            {value}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>

        </div>


        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </div>

  );

}


// =====================================================
// MINI STAT
// =====================================================

function MiniStatCard({
  title,
  value
}) {

  return (

    <div className="bg-white rounded-2xl border border-stone-200 p-6">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-bold text-gray-950 mt-2">
        {value}
      </p>

    </div>

  );

}


// =====================================================
// ADMIN TABLE
// =====================================================

function AdminTable({
  title,
  subtitle,
  columns,
  children
}) {

  return (

    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">

      <div className="p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">

        <div>

          <h2 className="text-xl font-bold text-gray-950">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>

        </div>

      </div>


      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="bg-stone-50">

              {columns.map(
                column => (

                  <th
                    key={
                      column
                    }
                    className="p-4 text-left font-semibold text-gray-600 whitespace-nowrap"
                  >
                    {column}
                  </th>

                )
              )}

            </tr>

          </thead>


          <tbody>
            {children}
          </tbody>

        </table>

      </div>

    </div>

  );

}


// =====================================================
// DETAIL MODAL
// =====================================================

function DetailModal({
  type,
  record,
  onClose
}) {

  const titleMap = {

    user:
      "User Details",

    listing:
      "Listing Details",

    swap:
      "Swap Details",

    review:
      "Review Details",

    report:
      "Moderation Report"

  };


  return (

    <div className="fixed inset-0 z-50 bg-black/60 p-4 md:p-8 overflow-y-auto">

      <div className="min-h-full flex items-center justify-center">

        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-gray-950 text-white p-6 flex items-center justify-between">

            <div>

              <p className="text-green-400 text-xs font-bold tracking-widest uppercase">
                Admin View
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {titleMap[type]}
              </h2>

            </div>


            <button
              onClick={
                onClose
              }
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-xl"
            >
              ×
            </button>

          </div>


          <div className="p-6">

            {type === "user" && (

              <div className="space-y-5">

                <DetailHeader
                  initials={
                    record.name
                      ?.charAt(
                        0
                      )
                      .toUpperCase()
                  }
                  title={
                    record.name
                  }
                  subtitle={
                    record.email
                  }
                />


                <DetailGrid
                  rows={[
                    ["Name", record.name],
                    ["Email", record.email],
                    ["Location", record.location],
                    ["Role", record.role],
                    ["Joined", formatDateStatic(record)],
                    ["User ID", record._id]
                  ]}
                />

              </div>

            )}


            {type === "listing" && (

              <div className="space-y-6">

                <ListingGallery
                  listing={
                    record
                  }
                />


                <DetailGrid
                  rows={[
                    ["Title", record.title],
                    ["Category", record.category],
                    ["Brand", record.brand],
                    ["Size", record.size],
                    ["Condition", record.condition],
                    ["Owner", record.owner?.name],
                    ["Owner Email", record.owner?.email],
                    ["Location", record.location],
                    ["Swap Value", record.swapValue],
                    ["Status", record.status],
                    ["Created", formatDateStatic(record)]
                  ]}
                />

              </div>

            )}


            {type === "swap" && (

              <DetailGrid
                rows={[
                  ["Requester", record.requester?.name],
                  ["Requester Email", record.requester?.email],
                  ["Requested Item", record.listing?.title],
                  ["Requested Item Value", record.listing?.swapValue],
                  ["Offered Item", record.offeredListing?.title],
                  ["Offered Item Value", record.offeredListing?.swapValue],
                  ["Status", record.status],
                  ["Delivery Method", record.deliveryMethod],
                  ["Courier Status", record.courierStatus],
                  ["Courier", record.courierName],
                  ["Tracking Number", record.trackingNumber],
                  ["Created", formatDateStatic(record)]
                ]}
              />

            )}


            {type === "review" && (

              <div className="space-y-6">

                <div className="bg-amber-50 rounded-2xl p-5">

                  <div className="text-2xl text-amber-500">
                    {"★".repeat(
                      Number(
                        record.rating ||
                        0
                      )
                    )}
                  </div>

                  <p className="text-gray-800 mt-3 leading-relaxed">
                    {record.comment ||
                      "No comment"}
                  </p>

                </div>


                <DetailGrid
                  rows={[
                    ["Reviewer", record.reviewer?.name],
                    ["Reviewer Email", record.reviewer?.email],
                    ["Reviewed User", record.reviewedUser?.name],
                    ["Reviewed User Email", record.reviewedUser?.email],
                    ["Swap Status", record.swapRequest?.status],
                    ["Created", formatDateStatic(record)]
                  ]}
                />

              </div>

            )}


            {type === "report" && (

              <div className="space-y-6">

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">

                  <p className="text-xs uppercase tracking-widest font-bold text-amber-700">
                    Reason
                  </p>

                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {record.reason ||
                      "—"}
                  </p>

                </div>


                <DetailGrid
                  rows={[
                    ["Reporter", record.reporter?.name],
                    ["Reporter Email", record.reporter?.email],
                    ["Reported User", record.reportedUser?.name],
                    ["Reported User Email", record.reportedUser?.email],
                    ["Listing", record.listing?.title],
                    ["Status", record.status],
                    ["Created", formatDateStatic(record)]
                  ]}
                />

              </div>

            )}

          </div>


          <div className="p-6 border-t border-stone-200 flex justify-end">

            <button
              onClick={
                onClose
              }
              className="px-6 py-3 rounded-xl bg-gray-950 text-white font-semibold hover:bg-gray-800"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}


// =====================================================
// LISTING GALLERY
// =====================================================

function ListingGallery({
  listing
}) {

  const urls =
    getImageUrls(
      listing
    );


  if (
    urls.length ===
    0
  ) {

    return (

      <div className="h-72 rounded-2xl bg-stone-100 flex items-center justify-center text-gray-400 text-5xl">
        👕
      </div>

    );

  }


  return (

    <div>

      <div className="h-80 bg-stone-100 rounded-2xl overflow-hidden flex items-center justify-center">

        <img
          src={
            urls[0]
          }
          alt={
            listing.title
          }
          className="w-full h-full object-contain"
        />

      </div>


      {urls.length >
        1 && (

        <div className="grid grid-cols-4 gap-3 mt-3">

          {urls.map(
            (
              url,
              index
            ) => (

              <div
                key={
                  `${url}-${index}`
                }
                className="h-20 bg-stone-100 rounded-xl overflow-hidden border border-stone-200"
              >

                <img
                  src={
                    url
                  }
                  alt={`${listing.title} ${index + 1}`}
                  className="w-full h-full object-contain"
                />

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


// =====================================================
// DETAIL HEADER
// =====================================================

function DetailHeader({
  initials,
  title,
  subtitle
}) {

  return (

    <div className="flex items-center gap-4">

      <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center text-2xl font-bold">
        {initials || "U"}
      </div>

      <div>

        <h3 className="text-xl font-bold text-gray-950">
          {title}
        </h3>

        <p className="text-gray-500 mt-1">
          {subtitle}
        </p>

      </div>

    </div>

  );

}


// =====================================================
// DETAIL GRID
// =====================================================

function DetailGrid({
  rows
}) {

  return (

    <div className="grid md:grid-cols-2 gap-3">

      {rows.map(
        (
          [
            label,
            value
          ],
          index
        ) => (

          <div
            key={
              `${label}-${index}`
            }
            className="bg-stone-50 rounded-xl p-4"
          >

            <p className="text-xs uppercase tracking-wider text-gray-400">
              {label}
            </p>

            <p className="font-semibold text-gray-900 mt-1 break-words">
              {value ||
                "—"}
            </p>

          </div>

        )
      )}

    </div>

  );

}


// =====================================================
// REPORT SECTION
// =====================================================

function ReportSection({
  title,
  rows
}) {

  return (

    <div className="bg-white rounded-2xl border border-stone-200 p-5">

      <h3 className="font-bold text-gray-950">
        {title}
      </h3>


      <div className="mt-4 space-y-3">

        {rows.map(
          (
            [label, value],
            index
          ) => (

            <div
              key={
                `${label}-${index}`
              }
              className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0"
            >

              <span className="text-sm text-gray-500">
                {label}
              </span>

              <span className="font-bold text-gray-950">
                {value}
              </span>

            </div>

          )
        )}

      </div>

    </div>

  );

}


// =====================================================
// REPORT METRIC
// =====================================================

function ReportMetric({
  label,
  value
}) {

  return (

    <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">

      <p className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="text-2xl font-bold text-gray-950 mt-2">
        {value}
      </p>

    </div>

  );

}


// =====================================================
// PREVIEW METRIC
// =====================================================

function PreviewMetric({
  label,
  value
}) {

  return (

    <div className="bg-white rounded-xl p-4 border border-stone-200">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-xl font-bold text-gray-950 mt-1">
        {value}
      </p>

    </div>

  );

}


// =====================================================
// QUICK BUTTON
// =====================================================

function QuickButton({
  children,
  onClick
}) {

  return (

    <button
      onClick={
        onClick
      }
      className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-sm font-semibold text-gray-700 transition"
    >
      {children}
    </button>

  );

}


// =====================================================
// ACTION BUTTON
// =====================================================

function ActionButton({
  children,
  onClick
}) {

  return (

    <button
      onClick={
        onClick
      }
      className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-gray-950 text-white text-xs font-semibold hover:bg-gray-800 transition mr-2"
    >
      {children}
    </button>

  );

}


// =====================================================
// DELETE BUTTON
// =====================================================

function DeleteButton({
  children,
  onClick
}) {

  return (

    <button
      onClick={
        onClick
      }
      className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition"
    >
      {children}
    </button>

  );

}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  value
}) {

  if (!value) {
    return (
      <span className="text-gray-400">
        —
      </span>
    );
  }


  const styles = {

    available:
      "bg-green-100 text-green-700",

    swapped:
      "bg-gray-100 text-gray-700",

    pending:
      "bg-amber-100 text-amber-700",

    accepted:
      "bg-blue-100 text-blue-700",

    completed:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",

    reviewed:
      "bg-blue-100 text-blue-700",

    resolved:
      "bg-green-100 text-green-700"

  };


  return (

    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
        styles[
          value
        ] ||
        "bg-stone-100 text-gray-700"
      }`}
    >
      {value}
    </span>

  );

}


// =====================================================
// EMPTY ROW
// =====================================================

function EmptyRow({
  columns,
  message
}) {

  return (

    <tr>

      <td
        colSpan={
          columns
        }
        className="p-12 text-center"
      >

        <div className="text-4xl mb-3">
          📭
        </div>

        <p className="font-semibold text-gray-800">
          {message}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Try changing your filters.
        </p>

      </td>

    </tr>

  );

}


// =====================================================
// LOADING
// =====================================================

function LoadingState() {

  return (

    <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">

      <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-green-600 animate-spin mx-auto"></div>

      <p className="text-gray-500 mt-4">
        Loading admin data...
      </p>

    </div>

  );

}


// =====================================================
// STATIC DATE HELPER FOR MODAL
// =====================================================

function formatDateStatic(
  recordOrDate
) {

  let date = null;


  if (
    typeof recordOrDate ===
      "object" &&
    recordOrDate
  ) {

    if (
      recordOrDate.createdAt
    ) {

      date =
        new Date(
          recordOrDate.createdAt
        );

    }


    if (
      !date &&
      recordOrDate._id &&
      /^[0-9a-fA-F]{24}$/.test(
        recordOrDate._id
      )
    ) {

      const seconds =
        parseInt(
          recordOrDate._id.substring(
            0,
            8
          ),
          16
        );

      date =
        new Date(
          seconds * 1000
        );

    }

  } else if (
    recordOrDate
  ) {

    date =
      new Date(
        recordOrDate
      );

  }


  if (
    !date ||
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "—";

  }


  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


export default AdminDashboard;