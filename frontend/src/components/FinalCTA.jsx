import { useNavigate } from "react-router-dom";

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <p className="text-green-400 font-semibold tracking-widest text-sm">
          GIVE FASHION ANOTHER LIFE
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mt-4">
          Wear More. Waste Less.
        </h2>

        <p className="text-gray-300 mt-5 max-w-xl mx-auto">
          Your unused clothes could become someone else's next favorite.
        </p>

        <button
          onClick={() => navigate("/create-listing")}
          className="mt-8 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-semibold transition"
        >
          List Your Clothes
        </button>

      </div>
    </section>
  );
}

export default FinalCTA;