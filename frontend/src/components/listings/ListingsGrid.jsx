import { motion } from "framer-motion";
import ListingCard from "./ListingCard";

function ListingsGrid({ listings, loading }) {

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 animate-pulse"
          >
            <div className="h-80 bg-stone-200"></div>

            <div className="p-5">
              <div className="h-5 bg-stone-200 rounded w-2/3"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2 mt-3"></div>
              <div className="h-10 bg-stone-200 rounded mt-6"></div>
            </div>
          </div>
        ))}

      </div>
    );
  }


  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-5xl">
          👕
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-5">
          No listings found
        </h2>

        <p className="text-gray-500 mt-2">
          Try changing your search or filters.
        </p>
      </motion.div>
    );
  }


  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {listings.map((item, index) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.05
          }}
        >
          <ListingCard item={item} />
        </motion.div>
      ))}

    </div>
  );
}

export default ListingsGrid;