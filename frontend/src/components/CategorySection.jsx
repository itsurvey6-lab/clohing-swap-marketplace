import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";

function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-10">

          <div>
            <p className="text-green-700 font-semibold tracking-widest text-sm">
              EXPLORE
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Discover Your Style
            </h2>
          </div>

          <button
            onClick={() => navigate("/listings")}
            className="hidden md:block text-green-700 font-semibold hover:underline"
          >
            View all →
          </button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <CategoryCard
            icon="👗"
            title="Dresses"
          />

          <CategoryCard
            icon="👕"
            title="Shirts"
          />

          <CategoryCard
            icon="🧥"
            title="Jackets"
          />

          <CategoryCard
            icon="👖"
            title="Pants"
          />

        </div>

      </div>
    </section>
  );
}

export default CategorySection;