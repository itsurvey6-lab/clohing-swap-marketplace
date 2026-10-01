import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import ListingCard from "./ListingCard";

function FreshListings() {
  const [listings, setListings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get("/listings");

        setListings(response.data.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="bg-stone-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-10">

          <div>
            <p className="text-green-700 font-semibold tracking-widest text-sm">
              COMMUNITY CLOSET
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Fresh Listings
            </h2>

            <p className="text-gray-600 mt-3">
              Find something new to you.
            </p>
          </div>

          <button
            onClick={() => navigate("/listings")}
            className="hidden md:block text-green-700 font-semibold hover:underline"
          >
            View all →
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {listings.slice(0, 3).map((item) => (
            <ListingCard
              key={item._id}
              item={item}
            />
          ))}

        </div>

      </div>
    </section>
  );
}

export default FreshListings;