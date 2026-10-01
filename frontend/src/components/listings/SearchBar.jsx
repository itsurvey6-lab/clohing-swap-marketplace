import { motion } from "framer-motion";

function SearchBar({ search, setSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">

        <span className="text-xl text-gray-400">
          🔍
        </span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clothes, brands, categories..."
          className="w-full outline-none text-gray-800 placeholder:text-gray-400"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        )}

      </div>
    </motion.div>
  );
}

export default SearchBar;