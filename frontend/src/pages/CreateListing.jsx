import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";


function CreateListing() {

    const navigate =
        useNavigate();


    const [title, setTitle] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [brand, setBrand] =
        useState("");

    const [size, setSize] =
        useState("");

    const [condition, setCondition] =
        useState("");

    const [location, setLocation] =
        useState("");

    const [imageFiles, setImageFiles] =
        useState([]);


    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // IMAGE SELECTION
    // =====================================================

    const handleImageChange = (e) => {

        const selectedFiles =
            Array.from(
                e.target.files
            );


        if (
            selectedFiles.length > 6
        ) {

            alert(
                "You can upload a maximum of 6 images."
            );

            return;

        }


        setImageFiles(
            selectedFiles
        );

    };


    // =====================================================
    // CREATE LISTING
    // =====================================================

    const handleCreateListing =
        async (e) => {

            e.preventDefault();


            if (
                imageFiles.length === 0
            ) {

                alert(
                    "Please select at least one image."
                );

                return;

            }


            try {

                setLoading(true);


                const formData =
                    new FormData();


                formData.append(
                    "title",
                    title
                );

                formData.append(
                    "category",
                    category
                );

                formData.append(
                    "brand",
                    brand
                );

                formData.append(
                    "size",
                    size
                );

                formData.append(
                    "condition",
                    condition
                );

                formData.append(
                    "location",
                    location
                );


                // Add all selected images
                imageFiles.forEach(
                    (file) => {

                        formData.append(
                            "image",
                            file
                        );

                    }
                );


                const response =
                    await api.post(
                        "/listings",
                        formData
                    );


                console.log(
                    "Created listing:",
                    response.data
                );


                alert(
                    "Listing created successfully!"
                );


                // Clear form
                setTitle("");
                setCategory("");
                setBrand("");
                setSize("");
                setCondition("");
                setLocation("");
                setImageFiles([]);


                // Return to dashboard
                navigate(
                    "/dashboard"
                );


            } catch (error) {

                console.log(
                    "Create listing error:",
                    error
                );


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


                {/* HEADER */}

                <div className="text-center mb-10">

                    <p className="text-green-700 font-semibold tracking-widest text-sm uppercase">
                        SHARE YOUR STYLE
                    </p>


                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                        Create a Listing
                    </h1>


                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">
                        Give your pre-loved clothing a new life by sharing it with the community.
                    </p>

                </div>


                {/* FORM */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.4
                    }}
                    className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 md:p-10"
                >

                    <form
                        onSubmit={
                            handleCreateListing
                        }
                    >


                        {/* TITLE + BRAND */}

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Item Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: Red Dress"
                                    required
                                    className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) =>
                                        setBrand(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: Zara"
                                    required
                                    className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                                />

                            </div>

                        </div>


                        {/* CATEGORY + SIZE */}

                        <div className="grid md:grid-cols-2 gap-6 mt-6">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600"
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


                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Size
                                </label>

                                <select
                                    value={size}
                                    onChange={(e) =>
                                        setSize(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600"
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


                        {/* CONDITION */}

                        <div className="mt-6">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Condition
                            </label>

                            <select
                                value={condition}
                                onChange={(e) =>
                                    setCondition(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600"
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

                            <p className="text-xs text-gray-400 mt-2">
                                Swap value is automatically calculated based on category, brand, and condition.
                            </p>

                        </div>


                        {/* LOCATION */}

                        <div className="mt-6">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                            </label>

                            <input
                                type="text"
                                value={location}
                                onChange={(e) =>
                                    setLocation(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Doha"
                                required
                                className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                            />

                        </div>


                        {/* IMAGES */}

                        <div className="mt-6">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Clothing Images
                            </label>


                            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 hover:border-green-600 transition">

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    multiple
                                    onChange={
                                        handleImageChange
                                    }
                                    className="w-full"
                                />


                                <p className="text-xs text-gray-400 mt-3">
                                    Upload up to 6 clear photos of your clothing item.
                                </p>


                                {/* IMAGE PREVIEWS */}

                                {imageFiles.length > 0 && (

                                    <div className="mt-5">

                                        <p className="text-sm font-semibold text-green-700 mb-3">
                                            {imageFiles.length} image
                                            {imageFiles.length > 1
                                                ? "s"
                                                : ""}{" "}
                                            selected
                                        </p>


                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                            {imageFiles.map(
                                                (
                                                    file,
                                                    index
                                                ) => (

                                                    <div
                                                        key={`${file.name}-${index}`}
                                                        className="bg-stone-100 rounded-xl p-2"
                                                    >

                                                        <img
                                                            src={URL.createObjectURL(
                                                                file
                                                            )}
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-32 object-contain rounded-lg"
                                                        />

                                                        <p className="text-xs text-gray-500 mt-2 truncate">
                                                            {file.name}
                                                        </p>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading
                                ? "Creating Listing..."
                                : "Create Listing"}
                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/listings"
                                )
                            }
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