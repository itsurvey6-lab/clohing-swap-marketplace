import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import getImageUrl from "../utils/imageUrl";

function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // DELETE LISTING
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/listings/${id}`);

      setListings((previousListings) =>
        previousListings.filter(
          (item) => item._id !== id
        )
      );

      alert("Listing deleted successfully");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data ||
        "Unable to delete listing"
      );

    }

  };


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        const [
          userResponse,
          listingsResponse,
          myRequestsResponse,
          incomingResponse
        ] = await Promise.all([

          api.get("/users/me"),

          api.get("/listings/my"),

          api.get("/swaprequests/my"),

          api.get("/swaprequests/incoming")

        ]);


        setUser(userResponse.data);


        setListings(
          listingsResponse.data.items ||
          listingsResponse.data ||
          []
        );


        setMyRequests(
          myRequestsResponse.data.items ||
          myRequestsResponse.data ||
          []
        );


        setIncomingRequests(
          incomingResponse.data.items ||
          incomingResponse.data ||
          []
        );


      } catch (error) {

        console.log(
          "Dashboard error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // =====================================================
  // LISTING STATISTICS
  // =====================================================

  const availableListings =
    listings.filter(
      (item) =>
        item.status === "available"
    );


  const swappedListings =
    listings.filter(
      (item) =>
        item.status === "swapped"
    );


  // =====================================================
  // SWAP REQUEST STATISTICS
  // =====================================================

  const pendingOutgoing =
    myRequests.filter(
      (request) =>
        request.status === "pending"
    );


  const pendingIncoming =
    incomingRequests.filter(
      (request) =>
        request.status === "pending"
    );


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {

    return (

      <main className="min-h-screen bg-stone-50">

        <section className="max-w-7xl mx-auto px-6 py-16">

          <div className="animate-pulse">

            <div className="h-10 bg-stone-200 rounded w-80"></div>

            <div className="h-5 bg-stone-200 rounded w-96 mt-4"></div>


            <div className="grid md:grid-cols-4 gap-5 mt-10">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="h-32 bg-stone-200 rounded-2xl"
                  ></div>

                )
              )}

            </div>

          </div>

        </section>

      </main>

    );

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (

    <main className="min-h-screen bg-stone-50">


      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-stone-100 border-b border-stone-200">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
          >

            <p className="text-green-700 font-semibold text-sm tracking-[0.2em] uppercase">
              My ReWear
            </p>


            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">

              Welcome back
              {user?.name
                ? `, ${user.name}`
                : ""}.

            </h1>


            <p className="text-gray-600 text-lg mt-4 max-w-2xl">

              Manage your clothing, track your swaps, and keep
              your wardrobe moving through the community.

            </p>

          </motion.div>

        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="max-w-7xl mx-auto px-6 pt-10">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">


          <Link
            to="/create-listing"
            className="bg-green-700 text-white rounded-2xl p-5 hover:bg-green-800 transition"
          >

            <p className="text-2xl">
              +
            </p>


            <h3 className="font-semibold mt-2">
              List an Item
            </h3>


            <p className="text-sm text-green-100 mt-1">
              Give something in your wardrobe a second life.
            </p>

          </Link>



          <Link
            to="/listings"
            className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition"
          >

            <p className="text-2xl">
              👕
            </p>


            <h3 className="font-semibold text-gray-900 mt-2">
              Browse Clothing
            </h3>


            <p className="text-sm text-gray-500 mt-1">
              Discover pieces from the community.
            </p>

          </Link>



          <Link
            to="/swap-requests"
            className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition"
          >

            <p className="text-2xl">
              🔄
            </p>


            <h3 className="font-semibold text-gray-900 mt-2">
              View Swaps
            </h3>


            <p className="text-sm text-gray-500 mt-1">
              Manage your incoming and outgoing requests.
            </p>

          </Link>


        </div>

      </section>



      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">


          <StatCard
            label="My listings"
            value={listings.length}
            description="Total pieces listed"
          />


          <StatCard
            label="Available"
            value={availableListings.length}
            description="Currently available"
          />


          <StatCard
            label="Pending swaps"
            value={
              pendingOutgoing.length +
              pendingIncoming.length
            }
            description="Waiting for action"
          />


          <StatCard
            label="Completed swaps"
            value={swappedListings.length}
            description="Listings marked swapped"
          />


        </div>

      </section>



      {/* =================================================
          PROFILE + SWAP SUMMARY
      ================================================= */}

      <section className="max-w-7xl mx-auto px-6 pb-12">

        <div className="grid lg:grid-cols-3 gap-8">


          {/* PROFILE */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="bg-white border border-stone-200 rounded-3xl p-7"
          >

            <div className="w-16 h-16 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-2xl font-bold">

              {user?.name
                ?.charAt(0)
                .toUpperCase() ||
                "U"}

            </div>


            <h2 className="text-xl font-bold text-gray-900 mt-5">
              {user?.name}
            </h2>


            <p className="text-gray-500 mt-1">
              {user?.email}
            </p>


            <div className="border-t border-stone-100 mt-6 pt-5">

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Location
              </p>


              <p className="text-gray-800 font-medium mt-1">
                📍 {user?.location}
              </p>

            </div>

          </motion.div>



          {/* SWAP SUMMARY */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-7"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-xs uppercase tracking-wider text-green-700 font-semibold">
                  Swap activity
                </p>


                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Keep things moving
                </h2>

              </div>


              <Link
                to="/swap-requests"
                className="text-sm font-semibold text-green-700 hover:text-green-800"
              >
                View all →
              </Link>

            </div>



            <div className="grid sm:grid-cols-2 gap-5 mt-7">


              {/* INCOMING */}

              <div className="bg-stone-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Incoming
                </p>


                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {pendingIncoming.length}
                </p>


                <p className="text-sm text-gray-500 mt-1">
                  pending requests
                </p>

              </div>



              {/* OUTGOING */}

              <div className="bg-stone-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Outgoing
                </p>


                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {pendingOutgoing.length}
                </p>


                <p className="text-sm text-gray-500 mt-1">
                  pending requests
                </p>

              </div>


            </div>

          </motion.div>

        </div>

      </section>



      {/* =================================================
          MY LISTINGS
      ================================================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">


        <div className="flex justify-between items-end mb-7">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-green-700 font-semibold">
              My wardrobe
            </p>


            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              My listings
            </h2>

          </div>


          <Link
            to="/create-listing"
            className="hidden sm:block text-sm font-semibold text-green-700 hover:text-green-800"
          >
            + Add another item
          </Link>

        </div>



        {listings.length === 0 ? (

          <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center">

            <div className="text-5xl">
              👕
            </div>


            <h3 className="text-xl font-bold text-gray-900 mt-5">
              Your wardrobe is empty
            </h3>


            <p className="text-gray-500 mt-2">
              List your first item and start swapping.
            </p>


            <Link
              to="/create-listing"
              className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition"
            >
              List Your First Item
            </Link>

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">


            {listings.map(
              (item, index) => (

                <motion.div
                  key={item._id}
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  className="bg-white border border-stone-200 rounded-3xl overflow-hidden"
                >


                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative">


                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-64 object-contain bg-stone-100"
                      />
                    ) : (
                      <div className="w-full h-64 bg-stone-100 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}



                    {/* SWAP VALUE TAG */}

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">

                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        Swap Value
                      </p>


                      <p className="text-sm font-bold text-green-700 text-center">
                        {item.swapValue}
                      </p>

                    </div>


                  </div>



                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="p-5">


                    <div className="flex justify-between items-start gap-3">


                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          {item.category}
                        </p>


                        <h3 className="text-lg font-bold text-gray-900 mt-1">
                          {item.title}
                        </h3>


                        <p className="text-sm text-gray-500 mt-1">
                          {item.brand}
                        </p>

                      </div>


                      <StatusBadge
                        status={item.status}
                      />


                    </div>



                    {/* SIZE */}

                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-stone-100">

                      <span className="text-sm text-gray-500">
                        Size {item.size}
                      </span>

                    </div>



                    {/* BUTTONS */}

                    <div className="flex gap-3 mt-5">


                      {/* VIEW */}

                      <button
                        onClick={() =>
                          navigate(
                            `/listings/${item._id}`
                          )
                        }
                        className="flex-1 border border-gray-900 text-gray-900 py-2.5 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition"
                      >
                        View Item
                      </button>



                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="flex-1 border border-red-600 text-red-600 py-2.5 rounded-full font-semibold hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>


                    </div>


                  </div>


                </motion.div>

              )
            )}


          </div>

        )}

      </section>

    </main>

  );

}



/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  label,
  value,
  description
}) {

  return (

    <motion.div
      whileHover={{
        y: -4
      }}
      className="bg-white border border-stone-200 rounded-2xl p-6"
    >

      <p className="text-sm text-gray-500">
        {label}
      </p>


      <p className="text-3xl font-bold text-gray-900 mt-2">
        {value}
      </p>


      <p className="text-xs text-gray-400 mt-1">
        {description}
      </p>

    </motion.div>

  );

}



/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status
}) {

  const styles = {

    available:
      "bg-green-50 text-green-700",

    swapped:
      "bg-gray-100 text-gray-600",

    pending:
      "bg-amber-50 text-amber-700"

  };


  return (

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >

      {status}

    </span>

  );

}


export default Dashboard;