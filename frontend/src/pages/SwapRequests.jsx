import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import api from "../services/api";

function SwapRequests() {
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const [myResponse, incomingResponse] = await Promise.all([
        api.get("/swaprequests/my"),
        api.get("/swaprequests/incoming")
      ]);

      console.log("My swap requests:", myResponse.data);
      console.log("Incoming swap requests:", incomingResponse.data);

      setMyRequests(
        myResponse.data.items || myResponse.data || []
      );

      setIncomingRequests(
        incomingResponse.data.items || incomingResponse.data || []
      );

    } catch (error) {
      console.log("Swap requests error:", error);

      setMyRequests([]);
      setIncomingRequests([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequest = async (id, status) => {
    try {
      setActionLoading(id);

      await api.put(`/swaprequests/${id}`, {
        status
      });

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

  return (
    <main className="min-h-screen bg-stone-50">

      {/* HERO */}

      <section className="bg-stone-100">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
          />

          {/* OUTGOING */}

          <RequestSection
            title="Your requests"
            description="Swap requests you've sent to other members."
            requests={myRequests}
            type="outgoing"
            actionLoading={actionLoading}
            updateRequest={updateRequest}
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
  updateRequest
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
  updateRequest
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

          {/* WANTED */}

          <ItemPreview
            title="Requested"
            item={wantedItem}
          />

          {/* OFFERED */}

          <ItemPreview
            title="Offered"
            item={offeredItem}
          />

        </div>

        {/* ACTIONS */}

        {status === "pending" && (

          <div className="mt-6">

            {type === "incoming" ? (

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

            )}

          </div>

        )}

      </div>

    </div>
  );
}


/* =====================================================
   ITEM PREVIEW
===================================================== */

function ItemPreview({ title, item }) {
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
          src={`http://localhost:5000/uploads/${item.image}`}
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

function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-amber-50 text-amber-700",

    accepted:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",

    cancelled:
      "bg-gray-100 text-gray-600"
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