import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        location,
      });

      console.log(response.data);
      alert("Registration successful");

      // Clear form after successful registration
      setName("");
      setEmail("");
      setPassword("");
      setLocation("");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-10">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">♻️</div>

          <h1 className="text-4xl font-bold text-gray-800">
            Join ReWear
          </h1>

          <p className="text-gray-500 mt-2">
            Swap • Reuse • Repeat
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Create your account
          </h2>

          <p className="text-gray-500 mb-6">
            Start exchanging clothes with the ReWear community.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                placeholder="e.g. Doha"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Create Account
            </motion.button>

          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 font-semibold hover:text-green-700"
            >
              Login
            </a>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Register;