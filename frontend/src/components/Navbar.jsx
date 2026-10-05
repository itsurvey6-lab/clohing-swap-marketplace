import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

function Navbar() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hasFavorites, setHasFavorites] = useState(false);

    const navigate = useNavigate();

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setHasFavorites(false);
            return;
        }

        try {
            const response = await api.get("/users/me");

            setUser(response.data);

            const favoritesResponse = await api.get(
                "/favorites/my"
            );

            const favorites =
                favoritesResponse.data || [];

            setHasFavorites(favorites.length > 0);

        } catch (error) {
            console.log("Navbar error:", error);

            setUser(null);
            setHasFavorites(false);
        }
    };

    useEffect(() => {
        loadUser();

        window.addEventListener(
            "login",
            loadUser
        );

        const handleFavoriteChange = () => {
            loadUser();
        };

        window.addEventListener(
            "favoriteChanged",
            handleFavoriteChange
        );

        return () => {
            window.removeEventListener(
                "login",
                loadUser
            );

            window.removeEventListener(
                "favoriteChanged",
                handleFavoriteChange
            );
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");

        setUser(null);
        setHasFavorites(false);
        setMenuOpen(false);

        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">

            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="min-h-20 flex items-center justify-between">

                    {/* LOGO */}

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white text-xl">
                            ♻
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">
                                ReWear
                            </h1>

                            <p className="text-[10px] uppercase tracking-widest text-gray-500">
                                Swap • Reuse • Repeat
                            </p>
                        </div>
                    </Link>


                    {/* DESKTOP NAVIGATION */}

                    <div className="hidden lg:flex items-center gap-6">

                        <Link
                            to="/"
                            className="text-sm font-medium text-gray-700 hover:text-green-700 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/listings"
                            className="text-sm font-medium text-gray-700 hover:text-green-700 transition"
                        >
                            Browse
                        </Link>

                        <Link
                            to="/favorites"
                            className={`text-sm font-medium transition ${
                                hasFavorites
                                    ? "text-red-500"
                                    : "text-gray-700 hover:text-green-700"
                            }`}
                        >
                            Favorites{" "}
                            {hasFavorites ? "♥" : "♡"}
                        </Link>

                        {user && (
                            <>
                                <Link
                                    to="/swap-requests"
                                    className="text-sm font-medium text-gray-700 hover:text-green-700 transition"
                                >
                                    Swaps
                                </Link>

                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium text-gray-700 hover:text-green-700 transition"
                                >
                                    Dashboard
                                </Link>

                                {/* ADMIN LINK */}

                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="text-sm font-semibold text-purple-700 hover:text-purple-900 transition"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </>
                        )}

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="hidden lg:flex items-center gap-4">

                        {user ? (
                            <>

                                <Link
                                    to="/create-listing"
                                    className="bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-800 transition shadow-sm"
                                >
                                    + List an Item
                                </Link>

                                <div className="flex items-center gap-3 pl-4 border-l border-stone-200">

                                    <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center font-semibold text-gray-700">
                                        {user.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="flex flex-col">

                                        <span className="text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </span>

                                        <button
                                            onClick={handleLogout}
                                            className="text-xs text-gray-500 hover:text-red-600 text-left transition"
                                        >
                                            Logout
                                        </button>

                                    </div>

                                </div>

                            </>
                        ) : (
                            <>

                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-gray-700 hover:text-green-700 transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
                                >
                                    Join ReWear
                                </Link>

                            </>
                        )}

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                        className="lg:hidden text-2xl text-gray-800 p-2"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                </div>


                {/* MOBILE MENU */}

                {menuOpen && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto"
                        }}
                        className="lg:hidden border-t border-stone-200 py-5"
                    >

                        <div className="flex flex-col gap-4">

                            <Link
                                to="/"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="text-gray-700 font-medium"
                            >
                                Home
                            </Link>

                            <Link
                                to="/listings"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="text-gray-700 font-medium"
                            >
                                Browse Clothes
                            </Link>

                            <Link
                                to="/favorites"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className={`font-medium ${
                                    hasFavorites
                                        ? "text-red-500"
                                        : "text-gray-700"
                                }`}
                            >
                                Favorites{" "}
                                {hasFavorites
                                    ? "♥"
                                    : "♡"}
                            </Link>

                            {user && (
                                <>

                                    <Link
                                        to="/swap-requests"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="text-gray-700 font-medium"
                                    >
                                        Swap Requests
                                    </Link>

                                    <Link
                                        to="/dashboard"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="text-gray-700 font-medium"
                                    >
                                        Dashboard
                                    </Link>

                                    {/* MOBILE ADMIN LINK */}

                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                            className="text-purple-700 font-semibold bg-purple-50 px-4 py-3 rounded-lg"
                                        >
                                            🛡 Admin Panel
                                        </Link>
                                    )}

                                    <Link
                                        to="/create-listing"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="bg-green-700 text-white text-center px-5 py-3 rounded-full font-semibold"
                                    >
                                        + List an Item
                                    </Link>

                                    <button
                                        onClick={
                                            handleLogout
                                        }
                                        className="text-left text-red-600 font-medium"
                                    >
                                        Logout
                                    </button>

                                </>
                            )}

                            {!user && (
                                <div className="flex flex-col gap-3 pt-2">

                                    <Link
                                        to="/login"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="text-center border border-stone-300 py-3 rounded-full font-semibold"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="text-center bg-gray-900 text-white py-3 rounded-full font-semibold"
                                    >
                                        Join ReWear
                                    </Link>

                                </div>
                            )}

                        </div>

                    </motion.div>
                )}

            </div>

        </nav>
    );
}

export default Navbar;