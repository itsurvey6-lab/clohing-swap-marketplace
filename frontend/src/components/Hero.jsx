import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="bg-stone-100 min-h-[85vh] flex items-center">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}

        <div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-green-700 font-semibold tracking-widest text-sm"
          >
            WEAR. SWAP. REPEAT.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mt-4"
          >
            Your Closet.
            <br />
            Someone Else's
            <span className="text-green-700"> Next Favorite.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed"
          >
            Swap clothes, discover new styles, and give your wardrobe
            a more sustainable story.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-8"
          >

            <button
              onClick={() => navigate("/listings")}
              className="bg-green-700 text-white px-7 py-3 rounded-full font-semibold hover:bg-green-800 transition"
            >
              Explore Clothes
            </button>

            <button
              onClick={() => navigate("/create-listing")}
              className="border border-gray-300 bg-white text-gray-800 px-7 py-3 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              Start Swapping
            </button>

          </motion.div>

          <div className="flex gap-8 mt-10 text-sm text-gray-500">

            <div>
              <p className="text-2xl font-bold text-gray-900">♻</p>
              <p>Reuse fashion</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">↔</p>
              <p>Easy swapping</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">♡</p>
              <p>Community driven</p>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >

          <div className="absolute -top-5 -right-5 w-24 h-24 bg-green-200 rounded-full opacity-60"></div>

          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
            alt="Fashion"
            className="relative w-full h-[520px] object-cover rounded-[2rem] shadow-xl"
          />

          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg">

            <p className="text-xs uppercase tracking-widest text-green-700 font-semibold">
              Sustainable Fashion
            </p>

            <p className="text-gray-900 font-semibold mt-1">
              Give your clothes another story.
            </p>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;

