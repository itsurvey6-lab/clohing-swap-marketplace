import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function SwapRequests() {

  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();


  // =====================================================
  // FETCH SWAP REQUESTS
  // =====================================================

  const fetchRequests = async () => {

    try {

      setLoading(true);

      const [myResponse, incomingResponse] = await Promise.all([
        api.get("/swaprequests/my"),
        api.get("/swaprequests/incoming")
      ]);

      console.log(
        "My swap requests:",
        myResponse.data
      );

      console.log(
        "Incoming swap requests:",
        incomingResponse.data
      );

      setMyRequests(
        myResponse.data.items ||
        myResponse.data ||
        []
      );

      setIncomingRequests(
        incomingResponse.data.items ||
        incomingResponse.data ||
        []
      );

    } catch (error) {

      console.log(
        "Swap requests error:",
        error
      );

      setMyRequests([]);
      setIncomingRequests([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  useEffect(() => {

    fetchRequests();

  }, []);


  // =====================================================
  // UPDATE NORMAL SWAP REQUEST
  // =====================================================

  const updateRequest = async (id, status) => {

    try {

      setActionLoading(id);

      await api.put(
        `/swaprequests/${id}`,
        {
          status
        }
      );

      alert(
        status === "accepted"
          ? "Swap request accepted!"
          : status === "rejected"
          ? "Swap request rejected."
          : "Swap request cancelled."
      );

      await fetchRequests();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to update swap request."
      );

    } finally {

      setActionLoading(null);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <main className="min-h-screen bg-stone-50">

        <section className="max-w-7xl mx-auto px-6 py-20">

          <div className="animate-pulse">

            <div className="h-10 bg-stone-200 rounded w-72"></div>

            <div className="h-5 bg-stone-200 rounded w-96 mt-4"></div>

            <div className="grid lg:grid-cols-2 gap-8 mt-12">

              <div className="h-64 bg-stone-200 rounded-3xl"></div>

              <div className="h-64 bg-stone-200 rounded-3xl"></div>

            </div>

          </div>

        </section>

      </main>

    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <main className="min-h-screen bg-stone-50">


      {/* HERO */}

      <section className="bg-stone-100">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
          >

            <p className="text-green-700 font-semibold text-sm tracking-[0.2em]">

              SWAP ACTIVITY

            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">

              Your swap requests

            </h1>

            <p className="text-gray-600 text-lg mt-4 max-w-2xl">

              Manage the clothing swaps you've requested
              and the offers you've received from the community.

            </p>

          </motion.div>

        </div>

      </section>


      {/* CONTENT */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-2 gap-10">


          {/* INCOMING */}

          <RequestSection
            title="Incoming requests"
            description="People who want to swap for your items."
            requests={incomingRequests}
            type="incoming"
            actionLoading={actionLoading}
            updateRequest={updateRequest}
            navigate={navigate}
            fetchRequests={fetchRequests}
          />


          {/* OUTGOING */}

          <RequestSection
            title="Your requests"
            description="Swap requests you've sent to other members."
            requests={myRequests}
            type="outgoing"
            actionLoading={actionLoading}
            updateRequest={updateRequest}
            navigate={navigate}
            fetchRequests={fetchRequests}
          />


        </div>

      </section>

    </main>

  );

}


/* =====================================================
   REQUEST SECTION
===================================================== */

function RequestSection({
  title,
  description,
  requests,
  type,
  actionLoading,
  updateRequest,
  navigate,
  fetchRequests
}) {

  return (

    <div>

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">

          {title}

        </h2>

        <p className="text-gray-500 mt-1">

          {description}

        </p>

      </div>


      {requests.length === 0 ? (

        <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center">

          <div className="text-4xl">

            {type === "incoming" ? "📥" : "📤"}

          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-4">

            No requests yet

          </h3>

          <p className="text-gray-500 text-sm mt-2">

            {type === "incoming"
              ? "You don't have any incoming swap requests."
              : "You haven't requested any swaps yet."
            }

          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {requests.map((request, index) => (

            <motion.div
              key={request._id}
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
            >

              <RequestCard
                request={request}
                type={type}
                actionLoading={actionLoading}
                updateRequest={updateRequest}
                navigate={navigate}
                fetchRequests={fetchRequests}
              />

            </motion.div>

          ))}

        </div>

      )}

    </div>

  );

}


/* =====================================================
   REQUEST CARD
===================================================== */

function RequestCard({
  request,
  type,
  actionLoading,
  updateRequest,
  navigate,
  fetchRequests
}) {

  const wantedItem = request.listing;

  const offeredItem = request.offeredListing;

  const requester = request.requester;

  const status = request.status || "pending";


  return (

    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">


      {/* HEADER */}

      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">

        <div>

          <p className="text-xs uppercase tracking-wider text-gray-400">

            Swap request

          </p>


          {type === "incoming" && requester && (

            <p className="font-semibold text-gray-900 mt-1">

              {requester.name}

            </p>

          )}


          {type === "outgoing" && (

            <p className="font-semibold text-gray-900 mt-1">

              Your offer

            </p>

          )}

        </div>


        <StatusBadge status={status} />

      </div>


      {/* ITEMS */}

      <div className="p-6">

        <div className="grid grid-cols-2 gap-4">

          <ItemPreview
            title="Requested"
            item={wantedItem}
          />

          <ItemPreview
            title="Offered"
            item={offeredItem}
          />

        </div>


        {/* ACTIONS */}

        <div className="mt-6 space-y-3">


          {/* OPEN CHAT */}

          <button
            onClick={() =>
              navigate(`/chat/${request._id}`)
            }
            className="w-full bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition"
          >

            Open Chat

          </button>


          {/* PENDING ACTIONS */}

          {status === "pending" && (

            type === "incoming" ? (

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    updateRequest(
                      request._id,
                      "accepted"
                    )
                  }
                  disabled={
                    actionLoading === request._id
                  }
                  className="flex-1 bg-green-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition disabled:opacity-50"
                >

                  {actionLoading === request._id
                    ? "Updating..."
                    : "Accept"
                  }

                </button>


                <button
                  onClick={() =>
                    updateRequest(
                      request._id,
                      "rejected"
                    )
                  }
                  disabled={
                    actionLoading === request._id
                  }
                  className="flex-1 border border-stone-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-stone-50 transition disabled:opacity-50"
                >

                  Reject

                </button>

              </div>

            ) : (

              <button
                onClick={() =>
                  updateRequest(
                    request._id,
                    "cancelled"
                  )
                }
                disabled={
                  actionLoading === request._id
                }
                className="w-full border border-stone-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-stone-50 transition disabled:opacity-50"
              >

                {actionLoading === request._id
                  ? "Cancelling..."
                  : "Cancel Request"
                }

              </button>

            )

          )}


          {/* COURIER SECTION */}

          {(status === "accepted" ||
            status === "completed") && (

            <CourierPanel
              request={request}
              type={type}
              fetchRequests={fetchRequests}
            />

          )}


          {/* REVIEW SECTION */}

          {status === "completed" && (

            <ReviewPanel
              request={request}
              type={type}
            />

          )}


        </div>

      </div>

    </div>

  );

}


/* =====================================================
   REVIEW PANEL
===================================================== */

function ReviewPanel({
  request,
  type
}) {

  const [reviewed, setReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [saving, setSaving] = useState(false);


  // =====================================================
  // FIND THE OTHER USER
  // =====================================================

  const getOtherUser = () => {

    if (type === "incoming") {

      // Incoming request:
      // Current user is the listing owner.
      // The requester is the other user.

      return request.requester;

    }

    // Outgoing request:
    // Current user is the requester.
    // The listing owner is the other user.

    if (request.listing?.owner) {

      return {
        _id: request.listing.owner._id ||
             request.listing.owner,
        name: request.listing.owner.name || ""
      };

    }

    return null;

  };


  // =====================================================
  // CHECK EXISTING REVIEW
  // =====================================================

  useEffect(() => {

    const checkReview = async () => {

      try {

        setCheckingReview(true);

        const response = await api.get(
          `/reviews/swap/${request._id}`
        );

        setReviewed(
          response.data.reviewed === true
        );

      } catch (error) {

        console.log(
          "Review check error:",
          error
        );

        setReviewed(false);

      } finally {

        setCheckingReview(false);

      }

    };

    checkReview();

  }, [request._id]);


  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = async () => {

    const otherUser = getOtherUser();

    if (!otherUser?._id) {

      alert(
        "Unable to identify the other user."
      );

      return;

    }


    if (!rating) {

      alert(
        "Please select a rating."
      );

      return;

    }


    try {

      setSaving(true);

      await api.post(
        "/reviews",
        {
          swapRequest: request._id,
          reviewedUser: otherUser._id,
          rating,
          comment
        }
      );

      setReviewed(true);
      setShowForm(false);

      alert(
        "Review submitted successfully!"
      );

    } catch (error) {

      console.log(
        "Submit review error:",
        error
      );

      alert(
        error.response?.data ||
        "Unable to submit review."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // LOADING REVIEW STATUS
  // =====================================================

  if (checkingReview) {

    return (

      <div className="mt-4 border border-stone-200 rounded-2xl p-4 bg-stone-50">

        <p className="text-sm text-gray-500">

          Checking review status...

        </p>

      </div>

    );

  }


  // =====================================================
  // ALREADY REVIEWED
  // =====================================================

  if (reviewed) {

    return (

      <div className="mt-4 border border-green-200 bg-green-50 rounded-2xl p-4">

        <div className="flex items-center gap-2">

          <span className="text-xl">

            ⭐

          </span>

          <p className="font-semibold text-green-800">

            Review submitted

          </p>

        </div>

        <p className="text-sm text-green-700 mt-1">

          Thank you for reviewing your swap partner.

        </p>

      </div>

    );

  }


  // =====================================================
  // REVIEW FORM
  // =====================================================

  if (showForm) {

    return (

      <div className="mt-4 border border-stone-200 rounded-2xl bg-stone-50 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider text-gray-400">

              Completed swap

            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-1">

              Leave a review

            </h3>

          </div>


          <button
            onClick={() =>
              setShowForm(false)
            }
            className="text-sm text-gray-500 hover:text-gray-900"
          >

            Cancel

          </button>

        </div>


        {/* RATING */}

        <div className="mt-5">

          <p className="text-sm font-semibold text-gray-700 mb-2">

            Your rating

          </p>


          <div className="flex gap-2">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() =>
                  setRating(star)
                }
                className={`text-3xl transition ${
                  star <= rating
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >

                ★

              </button>

            ))}

          </div>

        </div>


        {/* COMMENT */}

        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-700 mb-2">

            Comment

          </label>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows="4"
            placeholder="Share your swap experience..."
            className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none resize-none"
          />

        </div>


        {/* SUBMIT */}

        <button
          onClick={submitReview}
          disabled={saving}
          className="w-full mt-5 bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >

          {saving
            ? "Submitting..."
            : "Submit Review"
          }

        </button>

      </div>

    );

  }


  // =====================================================
  // LEAVE REVIEW BUTTON
  // =====================================================

  return (

    <button
      onClick={() =>
        setShowForm(true)
      }
      className="w-full border border-yellow-400 bg-yellow-50 text-yellow-700 py-3 rounded-full font-semibold hover:bg-yellow-100 transition"
    >

      ⭐ Leave Review

    </button>

  );

}


/* =====================================================
   COURIER PANEL
===================================================== */

function CourierPanel({
  request,
  type,
  fetchRequests
}) {

  const [deliveryMethod, setDeliveryMethod] = useState(
    request.deliveryMethod || "local"
  );

  const [senderAddress, setSenderAddress] = useState(
    request.senderAddress || ""
  );

  const [receiverAddress, setReceiverAddress] = useState(
    request.receiverAddress || ""
  );

  const [courierStatus, setCourierStatus] = useState(
    request.courierStatus || "not_required"
  );

  const [courierName, setCourierName] = useState(
    request.courierName || ""
  );

  const [trackingNumber, setTrackingNumber] = useState(
    request.trackingNumber || ""
  );

  const [saving, setSaving] = useState(false);


  // =====================================================
  // START DELIVERY
  // =====================================================

  const startDelivery = async () => {

    try {

      if (deliveryMethod === "courier") {

        if (!senderAddress.trim() ||
            !receiverAddress.trim()) {

          alert(
            "Please enter both sender and receiver addresses."
          );

          return;

        }

      }

      setSaving(true);

      await api.put(
        `/swaprequests/${request._id}/courier`,
        {
          deliveryMethod,
          senderAddress,
          receiverAddress
        }
      );

      alert(
        deliveryMethod === "courier"
          ? "Courier delivery started."
          : "Local swap selected."
      );

      await fetchRequests();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to update delivery method."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // UPDATE COURIER STATUS
  // =====================================================

  const updateCourierStatus = async (newStatus) => {

    try {

      setSaving(true);

      await api.put(
        `/swaprequests/${request._id}/courier/status`,
        {
          courierStatus: newStatus
        }
      );

      setCourierStatus(newStatus);

      await fetchRequests();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to update courier status."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // UPDATE COURIER INFORMATION
  // =====================================================

  const saveCourierInformation = async () => {

    try {

      setSaving(true);

      await api.put(
        `/swaprequests/${request._id}/courier/info`,
        {
          courierName,
          trackingNumber
        }
      );

      alert("Courier information updated.");

      await fetchRequests();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to update courier information."
      );

    } finally {

      setSaving(false);

    }

  };


  const statusSteps = [
    "pending",
    "pickup_scheduled",
    "picked_up",
    "in_transit",
    "delivered",
    "completed"
  ];


  const currentIndex =
    statusSteps.indexOf(courierStatus);


  return (

    <div className="mt-5 border border-stone-200 rounded-2xl bg-stone-50 p-5">


      {/* TITLE */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-wider text-gray-400">

            Delivery

          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-1">

            🚚 Swap delivery

          </h3>

        </div>


        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 capitalize">

          {deliveryMethod}

        </span>

      </div>


      {/* DELIVERY METHOD */}

      <div className="mt-5">

        <label className="block text-sm font-semibold text-gray-700 mb-2">

          Delivery method

        </label>

        <select
          value={deliveryMethod}
          onChange={(e) =>
            setDeliveryMethod(e.target.value)
          }
          disabled={
            courierStatus !== "not_required" &&
            courierStatus !== "pending"
          }
          className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none"
        >

          <option value="local">
            Local Swap
          </option>

          <option value="courier">
            Courier / Remote Swap
          </option>

        </select>

      </div>


      {/* ADDRESS FIELDS */}

      {deliveryMethod === "courier" && (

        <div className="mt-4 space-y-3">

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Sender address

            </label>

            <input
              type="text"
              value={senderAddress}
              onChange={(e) =>
                setSenderAddress(e.target.value)
              }
              placeholder="Enter sender address"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none"
            />

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Receiver address

            </label>

            <input
              type="text"
              value={receiverAddress}
              onChange={(e) =>
                setReceiverAddress(e.target.value)
              }
              placeholder="Enter receiver address"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none"
            />

          </div>

        </div>

      )}


      {/* START BUTTON */}

      {(courierStatus === "not_required" ||
        courierStatus === "pending") && (

        <button
          onClick={startDelivery}
          disabled={saving}
          className="w-full mt-4 bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >

          {saving
            ? "Saving..."
            : deliveryMethod === "courier"
            ? "Start Courier Delivery"
            : "Save Local Swap"
          }

        </button>

      )}


      {/* COURIER PROGRESS */}

      {deliveryMethod === "courier" &&
       courierStatus !== "not_required" && (

        <div className="mt-6">

          <p className="text-sm font-semibold text-gray-700 mb-3">

            Courier progress

          </p>


          <div className="space-y-2">

            {statusSteps.map((step, index) => {

              const completed =
                index <= currentIndex;

              return (

                <div
                  key={step}
                  className="flex items-center gap-3"
                >

                  <div
                    className={`w-3 h-3 rounded-full ${
                      completed
                        ? "bg-green-600"
                        : "bg-stone-300"
                    }`}
                  ></div>


                  <span
                    className={`text-sm capitalize ${
                      completed
                        ? "text-green-700 font-semibold"
                        : "text-gray-400"
                    }`}
                  >

                    {step.replaceAll(
                      "_",
                      " "
                    )}

                  </span>

                </div>

              );

            })}

          </div>

        </div>

      )}


      {/* STATUS UPDATE BUTTONS */}

      {deliveryMethod === "courier" &&
       courierStatus !== "not_required" &&
       courierStatus !== "completed" && (

        <div className="mt-5">

          <p className="text-sm font-semibold text-gray-700 mb-3">

            Update courier status

          </p>


          <div className="grid grid-cols-2 gap-2">

            {statusSteps
              .filter(
                (step) =>
                  step !== "pending" &&
                  statusSteps.indexOf(step) >
                  currentIndex
              )
              .map((step) => (

                <button
                  key={step}
                  onClick={() =>
                    updateCourierStatus(step)
                  }
                  disabled={saving}
                  className="border border-stone-300 bg-white text-gray-700 py-2 px-3 rounded-xl text-sm font-semibold hover:bg-stone-100 transition disabled:opacity-50"
                >

                  {step.replaceAll(
                    "_",
                    " "
                  )}

                </button>

              ))}

          </div>

        </div>

      )}


      {/* COURIER INFORMATION */}

      {deliveryMethod === "courier" && (

        <div className="mt-6 border-t border-stone-200 pt-5">

          <p className="text-sm font-semibold text-gray-700 mb-3">

            Courier information

          </p>


          <input
            type="text"
            value={courierName}
            onChange={(e) =>
              setCourierName(e.target.value)
            }
            placeholder="Courier name"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white mb-3 outline-none"
          />


          <input
            type="text"
            value={trackingNumber}
            onChange={(e) =>
              setTrackingNumber(e.target.value)
            }
            placeholder="Tracking number"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white mb-3 outline-none"
          />


          <button
            onClick={saveCourierInformation}
            disabled={saving}
            className="w-full border border-gray-900 text-gray-900 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition disabled:opacity-50"
          >

            {saving
              ? "Saving..."
              : "Save Courier Information"
            }

          </button>

        </div>

      )}


    </div>

  );

}


/* =====================================================
   ITEM PREVIEW
===================================================== */

function ItemPreview({
  title,
  item
}) {

  if (!item) {

    return (

      <div className="bg-stone-50 rounded-2xl p-4">

        <p className="text-xs uppercase tracking-wider text-gray-400">

          {title}

        </p>

        <p className="text-sm text-gray-400 mt-3">

          Item unavailable

        </p>

      </div>

    );

  }


  return (

    <div className="bg-stone-50 rounded-2xl overflow-hidden">

      {item.image ? (

        <img
          src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${item.image}`}
          alt={item.title}
          className="w-full h-40 object-cover"
        />

      ) : (

        <div className="w-full h-40 bg-stone-100 flex items-center justify-center text-gray-400">

          No image

        </div>

      )}


      <div className="p-4">

        <p className="text-xs uppercase tracking-wider text-gray-400">

          {title}

        </p>

        <h3 className="font-semibold text-gray-900 mt-1">

          {item.title}

        </h3>

        <p className="text-sm text-gray-500 mt-1">

          {item.brand}

        </p>

        <div className="flex justify-between mt-3 text-xs text-gray-500">

          <span>

            Size {item.size}

          </span>

          <span>

            {item.swapValue}

          </span>

        </div>

      </div>

    </div>

  );

}


/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status
}) {

  const styles = {

    pending:
      "bg-amber-50 text-amber-700",

    accepted:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",

    cancelled:
      "bg-gray-100 text-gray-600",

    completed:
      "bg-blue-50 text-blue-700"

  };


  return (

    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
        styles[status] || styles.pending
      }`}
    >

      {status}

    </span>

  );

}


export default SwapRequests;