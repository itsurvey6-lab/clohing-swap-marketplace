import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import getImageUrl from "../utils/imageUrl";

import api from "../services/api";

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const response = await api.get("/favorites/my");

      console.log("Favorites:", response.data);

      setFavorites(response.data || []);

    } catch (error) {
      console.log("Favorites error:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      window.dispatchEvent(
        new Event("favoriteChanged")
      );

      setFavorites((previous) =>
        previous.filter(
          (favorite) => favorite._id !== favoriteId
        )
      );

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
        "Unable to remove favorite."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-500">
          Loading favorites...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">

      {/* HERO */}

      <section className="bg-stone-100 border-b border-stone-200">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <p className="text-green-700 font-semibold text-sm tracking-[0.2em] uppercase">
            YOUR COLLECTION
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Saved pieces
          </h1>

          <p className="text-gray-600 text-lg mt-4 max-w-2xl">
            Keep the pieces you love close and come back
            when you're ready to make a swap.
          </p>

        </div>

      </section>


      {/* FAVORITES */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        {favorites.length === 0 ? (

          <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center">

            <div className="text-6xl">
              ♡
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-5">
              No saved pieces yet
            </h2>

            <p className="text-gray-500 mt-2">
              Browse the marketplace and save pieces you love.
            </p>

            <button
              onClick={() => navigate("/listings")}
              className="mt-7 bg-gray-900 text-white px-7 py-3 rounded-full font-semibold"
            >
              Browse Clothing
            </button>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

            {favorites.map((favorite, index) => {

              const item = favorite.listing;

              if (!item) {
                return null;
              }

              return (

                <motion.article
                  key={favorite._id}
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
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm"
                >

                  {/* IMAGE */}

                  <div className="relative">

                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-80 object-contain bg-stone-100"
                      />
                    ) : (
                      <div className="w-full h-80 bg-stone-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}


                    {/* REMOVE FAVORITE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFavorite(favorite._id)
                      }
                      className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 text-xl hover:scale-110 transition"
                      title="Remove favorite"
                    >
                      ♥
                    </button>

                  </div>


                  {/* DETAILS */}

                  <div className="p-5">

                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {item.category}
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.brand}
                    </p>


                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-stone-100">

                      <span className="text-sm text-gray-500">
                        Size {item.size}
                      </span>

                      <span className="font-bold text-green-700">
                        {item.swapValue}
                      </span>

                    </div>


                    <p className="text-sm text-gray-500 mt-3">
                      📍 {item.location}
                    </p>


                    {/* VIEW ITEM */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/listings/${item._id}`)
                      }
                      className="w-full mt-5 border border-gray-900 text-gray-900 py-2.5 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition"
                    >
                      View Item
                    </button>

                  </div>

                </motion.article>

              );

            })}

          </div>

        )}

      </section>

    </main>
  );
}

export default Favorites;