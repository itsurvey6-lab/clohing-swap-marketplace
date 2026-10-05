import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function CategoryCard({ icon, title }) {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    // Match the category values used in the backend
    const categoryMap = {
      Dresses: "Dress",
      Shirts: "Shirt",
      Jackets: "Jacket",
      Pants: "Pants"
    };

    const category = categoryMap[title] || title;

    navigate(`/listings?category=${encodeURIComponent(category)}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      onClick={handleCategoryClick}
      className="bg-white border border-stone-200 rounded-2xl p-8 text-center cursor-pointer hover:shadow-lg"
    >
      <div className="text-5xl">{icon}</div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        Explore {title.toLowerCase()}
      </p>
    </motion.div>
  );
}

export default CategoryCard;