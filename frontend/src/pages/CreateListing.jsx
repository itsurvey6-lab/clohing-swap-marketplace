
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";

function CreateListing() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [swapValue, setSwapValue] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // CREATE LISTING
  // =========================

  const handleCreateListing = async (e) => {

    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("size", size);
    formData.append("condition", condition);
    formData.append("swapValue", swapValue);
    formData.append("location", location);
    formData.append("image", image);

    try {

      setLoading(true);

      const response = await api.post(
        "/listings",
        formData
      );

      console.log(response.data);

      alert("Listing created successfully!");

      // Clear form
      setTitle("");
      setCategory("");
      setBrand("");
      setSize("");
      setCondition("");
      setSwapValue("");
      setLocation("");
      setImage(null);

      // Go to listings page
      navigate("/listings");

    } catch (error) {

      console.log("Create listing error:", error);

      alert(
        error.response?.data ||
        "Failed to create listing."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-stone-50 py-16">

      <div className="max-w-4xl mx-auto px-6">

        {/* =========================
            PAGE HEADER
        ========================== */}

        <div className="text-center mb-10">

          <p className="text-green-700 font-semibold tracking-widest text-sm uppercase">
            SHARE YOUR STYLE
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Create a Listing
          </h1>

          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Give your pre-loved clothing a new life by
            sharing it with the community.
          </p>

        </div>


        {/* =========================
            FORM CARD
        ========================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 md:p-10"
        >

          <form onSubmit={handleCreateListing}>

            {/* =========================
                TITLE + BRAND
            ========================== */}

            <div className="grid md:grid-cols-2 gap-6">

              {/* TITLE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Example: Red Dress"
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                />

              </div>


              {/* BRAND */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  placeholder="Example: Zara"
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                />

              </div>

            </div>


            {/* =========================
                CATEGORY + SIZE
            ========================== */}

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Dress">
                    Dress
                  </option>

                  <option value="Shirt">
                    Shirt
                  </option>

                  <option value="Top">
                    Top
                  </option>

                  <option value="T-Shirt">
                    T-Shirt
                  </option>

                  <option value="Jeans">
                    Jeans
                  </option>

                  <option value="Trousers">
                    Trousers
                  </option>

                  <option value="Jacket">
                    Jacket
                  </option>

                  <option value="Skirt">
                    Skirt
                  </option>

                  <option value="Shoes">
                    Shoes
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* SIZE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Size
                </label>

                <select
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value)
                  }
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                >

                  <option value="">
                    Select size
                  </option>

                  <option value="XS">
                    XS
                  </option>

                  <option value="S">
                    S
                  </option>

                  <option value="M">
                    M
                  </option>

                  <option value="L">
                    L
                  </option>

                  <option value="XL">
                    XL
                  </option>

                  <option value="XXL">
                    XXL
                  </option>

                  <option value="Free Size">
                    Free Size
                  </option>

                </select>

              </div>

            </div>


            {/* =========================
                CONDITION + SWAP VALUE
            ========================== */}

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              {/* CONDITION */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition
                </label>

                <select
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value)
                  }
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                >

                  <option value="">
                    Select condition
                  </option>

                  <option value="New">
                    New
                  </option>

                  <option value="Like New">
                    Like New
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                </select>

              </div>


              {/* SWAP VALUE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Swap Value
                </label>

                <input
                  type="number"
                  min="1"
                  value={swapValue}
                  onChange={(e) =>
                    setSwapValue(e.target.value)
                  }
                  placeholder="Example: 50"
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Enter the value you expect for the swap.
                </p>

              </div>

            </div>


            {/* =========================
                LOCATION
            ========================== */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Example: Doha"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              />

            </div>


            {/* =========================
                IMAGE
            ========================== */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Clothing Image
              </label>

              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 hover:border-green-600 transition">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                  required
                  className="w-full text-sm text-gray-600"
                />

                <p className="text-xs text-gray-400 mt-3">
                  Upload a clear photo of your clothing item.
                </p>

                {image && (
                  <p className="text-sm text-green-700 font-medium mt-3">
                    Selected: {image.name}
                  </p>
                )}

              </div>

            </div>


            {/* =========================
                SUBMIT BUTTON
            ========================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading
                ? "Creating Listing..."
                : "Create Listing"
              }

            </button>


            {/* CANCEL */}

            <button
              type="button"
              onClick={() => navigate("/listings")}
              className="w-full mt-3 border border-stone-300 text-gray-700 py-3.5 rounded-full font-semibold hover:bg-stone-100 transition"
            >
              Cancel
            </button>

          </form>

        </motion.div>

      </div>

    </div>
  );
}

export default CreateListing;
