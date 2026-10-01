import { motion } from "framer-motion";

function ListingsHero() {
  return (
    <section className="bg-stone-100 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-green-700 font-semibold tracking-[0.2em] text-sm">
            COMMUNITY CLOSET
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mt-4 leading-tight">
            Find something
            <span className="text-green-700"> new to you.</span>
          </h1>

          <p className="text-gray-600 text-lg mt-5 max-w-2xl leading-relaxed">
            Discover pre-loved fashion from the community and find
            pieces worth giving a second life.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

export default ListingsHero;