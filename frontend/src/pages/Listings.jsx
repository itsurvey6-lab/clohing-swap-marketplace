import { useEffect, useState } from "react";

import api from "../services/api";

import ListingsHero from "../components/listings/ListingsHero";
import SearchBar from "../components/listings/SearchBar";
import ListingFilters from "../components/listings/ListingFilters";
import ListingsGrid from "../components/listings/ListingsGrid";

function Listings() {

  const [listings, setListings] = useState([]);

  const [nearbyListings, setNearbyListings] = useState([]);

  const [userLocation, setUserLocation] = useState("");

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    size: "",
    condition: "",
    sort: ""
  });

  const [loading, setLoading] = useState(true);

  const [nearbyLoading, setNearbyLoading] = useState(true);


  // =====================================================
  // LOAD LOCATION MATCHES
  // =====================================================

  useEffect(() => {

    const fetchLocationMatches = async () => {

      try {

        setNearbyLoading(true);

        const response = await api.get(
          "/listings/matches"
        );

        console.log(
          "Location matches:",
          response.data
        );

        setUserLocation(
          response.data.userLocation || ""
        );

        setNearbyListings(
          response.data.listings || []
        );

      } catch (error) {

        console.log(
          "Location matching error:",
          error
        );

        setNearbyListings([]);

      } finally {

        setNearbyLoading(false);

      }

    };


    fetchLocationMatches();

  }, []);


  // =====================================================
  // LOAD NORMAL LISTINGS
  // =====================================================

  useEffect(() => {

    const fetchListings = async () => {

      try {

        setLoading(true);

        const params = {};

        if (filters.category) {

          params.category =
            filters.category;

        }

        if (filters.size) {

          params.size =
            filters.size;

        }

        if (filters.condition) {

          params.condition =
            filters.condition;

        }

        if (filters.sort) {

          params.sort =
            filters.sort;

        }


        const response =
          await api.get(
            "/listings",
            {
              params
            }
          );


        console.log(
          "Listings API response:",
          response.data
        );


        let items =
          response.data.items || [];


        // =================================================
        // SEARCH
        // =================================================

        if (search.trim()) {

          const searchText =
            search.toLowerCase();


          items = items.filter(
            (item) =>

              item.title
                ?.toLowerCase()
                .includes(searchText) ||

              item.brand
                ?.toLowerCase()
                .includes(searchText) ||

              item.category
                ?.toLowerCase()
                .includes(searchText)

          );

        }


        setListings(items);


      } catch (error) {

        console.log(
          "Listings error:",
          error
        );

        setListings([]);

      } finally {

        setLoading(false);

      }

    };


    fetchListings();

  }, [
    search,
    filters.category,
    filters.size,
    filters.condition,
    filters.sort
  ]);


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");

    setFilters({

      category: "",
      size: "",
      condition: "",
      sort: ""

    });

  };


  return (

    <main className="bg-stone-50 min-h-screen">


      <ListingsHero />


      <section className="max-w-7xl mx-auto px-6 py-10">


        {/* SEARCH */}

        <SearchBar
          search={search}
          setSearch={setSearch}
        />


        {/* FILTERS */}

        <div className="mt-5">

          <ListingFilters
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
          />

        </div>


        {/* =================================================
            RECOMMENDED NEAR YOU
        ================================================== */}

        {!nearbyLoading &&
          nearbyListings.length > 0 && (

            <section className="mt-12">


              <div className="flex justify-between items-end mb-6">

                <div>

                  <p className="text-sm text-green-700 font-semibold">

                    Recommended near you

                  </p>


                  <h2 className="text-2xl font-bold text-gray-900 mt-1">

                    Available in {userLocation}

                  </h2>


                  <p className="text-sm text-gray-500 mt-1">

                    Items from your location are shown first.

                  </p>

                </div>


                <p className="text-sm text-gray-500">

                  {nearbyListings.filter(
                    (item) =>
                      item.location ===
                      userLocation
                  ).length}{" "}

                  nearby items

                </p>

              </div>


              <ListingsGrid
                listings={
                  nearbyListings.filter(
                    (item) =>
                      item.location ===
                      userLocation
                  )
                }

                loading={nearbyLoading}

              />

            </section>

          )}


        {/* =================================================
            ALL COMMUNITY LISTINGS
        ================================================== */}

        <div className="flex justify-between items-center mt-14 mb-6">


          <div>

            <p className="text-sm text-gray-500">

              Community marketplace

            </p>


            <h2 className="text-2xl font-bold text-gray-900">

              Available pieces

            </h2>

          </div>


          <p className="text-sm text-gray-500">

            {listings.length} items

          </p>


        </div>


        <ListingsGrid
          listings={listings}
          loading={loading}
        />


      </section>

    </main>

  );

}


export default Listings;