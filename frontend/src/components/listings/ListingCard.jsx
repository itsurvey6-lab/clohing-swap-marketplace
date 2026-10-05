
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";
import getImageUrl from "../../utils/imageUrl";

function ListingCard({ item }) {
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (isFavorite || favoriteLoading) {
      return;
    }

    try {
      setFavoriteLoading(true);

      // Backend expects "listingId"
      await api.post("/favorites/add", {
        listingId: item._id
      });

      // Change ♡ to red ♥
      setIsFavorite(true);

      window.dispatchEvent(
        new Event("favoriteChanged")
      );

    } catch (error) {
      console.log("Favorite error:", error);

      alert(
        error.response?.data ||
        "Unable to add favorite."
      );

    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleViewItem = () => {
    navigate(`/listings/${item._id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col h-full"
    >

      {/* =========================
          IMAGE
      ========================== */}

      <div className="relative h-96 bg-stone-100 overflow-hidden">

        {item.image ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.title}
            className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* =========================
            FAVORITE BUTTON
        ========================== */}

        <button
          type="button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-2xl hover:scale-110 transition"
          title="Add to favorites"
        >
          {isFavorite ? (
            <span className="text-red-500">
              ♥
            </span>
          ) : (
            <span className="text-gray-700">
              ♡
            </span>
          )}
        </button>

        {/* =========================
            SWAP VALUE TAG
        ========================== */}

        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-2.5 border border-stone-200">

          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
            Swap Value
          </p>

          <p className="text-xl font-bold text-green-700 leading-tight">
            {item.swapValue}
          </p>

        </div>

      </div>


      {/* =========================
          DETAILS
      ========================== */}

      <div className="p-5 flex flex-col flex-1">

        {/* CATEGORY */}

        <p className="text-xs uppercase tracking-wider text-gray-400">
          {item.category}
        </p>

        {/* TITLE */}

        <h3 className="text-xl font-bold text-gray-900 mt-1">
          {item.title}
        </h3>

        {/* BRAND */}

        <p className="text-sm text-gray-500 mt-1">
          {item.brand}
        </p>


        {/* CONDITION */}

        <div className="mt-4">

          <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {item.condition}
          </span>

        </div>


        {/* SIZE */}

        <div className="mt-5 pt-4 border-t border-stone-100">

          <span className="text-sm text-gray-500">
            Size {item.size}
          </span>

        </div>


        {/* LOCATION */}

        <p className="text-sm text-gray-500 mt-3">
          📍 {item.location}
        </p>


        {/* STATUS */}

        {item.status !== "available" && (
          <p className="text-sm text-gray-400 mt-2 capitalize">
            Status: {item.status}
          </p>
        )}


        {/* VIEW ITEM */}

        <button
          type="button"
          onClick={handleViewItem}
          className="w-full mt-auto pt-5"
        >
          <span className="block w-full border border-gray-900 text-gray-900 py-2.5 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition">
            View Item
          </span>
        </button>

      </div>

    </motion.article>
  );
}

export default ListingCard;
