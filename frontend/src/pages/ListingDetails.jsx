import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myListings, setMyListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState("");

  const [requestLoading, setRequestLoading] = useState(false);

  // Get the selected listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/listings/${id}`);

        console.log("Listing details:", response.data);

        setListing(response.data);
      } catch (error) {
        console.log(error);
        setError("Unable to load this listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Get my listings for the swap offer
  useEffect(() => {
    const fetchMyListings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await api.get("/listings/my");

        setMyListings(response.data.items || response.data || []);
      } catch (error) {
        console.log("My listings error:", error);
      }
    };

    fetchMyListings();
  }, []);

  const handleSwapRequest = async () => {
    if (!selectedListing) {
      alert("Please select an item to offer.");
      return;
    }

    try {
      setRequestLoading(true);

      await api.post("/swaprequests", {
        listing: id,
        offeredListing: selectedListing
      });

      alert("Swap request sent successfully!");

      navigate("/swap-requests");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
        "Unable to send swap request."
      );
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading item...
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Listing not found
          </h1>

          <button
            onClick={() => navigate("/listings")}
            className="mt-5 bg-gray-900 text-white px-6 py-3 rounded-full"
          >
            Back to Listings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">

      {/* Back button */}

      <div className="max-w-7xl mx-auto px-6 pt-8">

        <button
          onClick={() => navigate("/listings")}
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to listings
        </button>

      </div>

      {/* Details */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* IMAGE */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200"
          >

            {listing.image ? (
              <img
                src={`http://localhost:5000/uploads/${listing.image}`}
                alt={listing.title}
                className="w-full h-[600px] object-cover"
              />
            ) : (
              <div className="w-full h-[600px] bg-stone-100 flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}

          </motion.div>

          {/* INFORMATION */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >

            <p className="text-sm uppercase tracking-[0.2em] text-green-700 font-semibold">
              {listing.category}
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              {listing.title}
            </h1>

            <p className="text-lg text-gray-500 mt-3">
              {listing.brand}
            </p>

            {/* Swap value */}

            <div className="mt-8 p-6 bg-white rounded-2xl border border-stone-200">

              <p className="text-sm text-gray-400">
                Estimated swap value
              </p>

              <p className="text-3xl font-bold text-green-700 mt-1">
                {listing.swapValue}
              </p>

            </div>

            {/* Details */}

            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Size
                </p>

                <p className="font-semibold text-gray-900 mt-2">
                  {listing.size}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Condition
                </p>

                <p className="font-semibold text-gray-900 mt-2">
                  {listing.condition}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Location
                </p>

                <p className="font-semibold text-gray-900 mt-2">
                  📍 {listing.location}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Status
                </p>

                <p
                  className={`font-semibold mt-2 ${
                    listing.status === "available"
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {listing.status}
                </p>
              </div>

            </div>

            {/* SWAP SECTION */}

            {listing.status === "available" && (
              <div className="mt-8 bg-white rounded-3xl border border-stone-200 p-6">

                <h2 className="text-xl font-bold text-gray-900">
                  Want to swap?
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Choose one of your listings to offer in exchange.
                </p>

                {localStorage.getItem("token") ? (
                  <>
                    <select
                      value={selectedListing}
                      onChange={(e) =>
                        setSelectedListing(e.target.value)
                      }
                      className="w-full mt-5 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-green-600"
                    >
                      <option value="">
                        Select an item to offer
                      </option>

                      {myListings
                        .filter(
                          (item) => item._id !== listing._id
                        )
                        .map((item) => (
                          <option
                            key={item._id}
                            value={item._id}
                          >
                            {item.title} — {item.swapValue}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={handleSwapRequest}
                      disabled={requestLoading}
                      className="w-full mt-4 bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition disabled:opacity-50"
                    >
                      {requestLoading
                        ? "Sending..."
                        : "Request Swap"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full mt-5 bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                  >
                    Login to Request Swap
                  </button>
                )}

              </div>
            )}

          </motion.div>

        </div>

      </section>

    </main>
  );
}

export default ListingDetails;