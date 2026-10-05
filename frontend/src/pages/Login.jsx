import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async (e) => {


e.preventDefault();

try {

  const response = await api.post("/auth/login", {
    email,
    password
  });

  console.log(response.data);

  localStorage.setItem("token", response.data.token);

  window.dispatchEvent(new Event("login"));

  alert("Login successful");

  navigate("/");

} catch (error) {

  console.log(error);

  alert(
    error.response?.data ||
    "Login failed"
  );

}


};

return ( <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">


  <div className="w-full max-w-md">

    <div className="text-center mb-8">

      <p className="text-green-700 font-semibold text-sm tracking-widest">
        CLOTHING SWAP
      </p>

      <h1 className="text-4xl font-bold text-gray-900 mt-3">
        Welcome back
      </h1>

      <p className="text-gray-500 mt-3">
        Sign in to continue your clothing swap journey.
      </p>

    </div>

    <div className="bg-white border border-stone-200 rounded-3xl shadow-sm p-8">

      <form onSubmit={handleLogin}>

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
          />

        </div>

        <div className="mt-5">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
          />

        </div>

        <button
          type="submit"
          className="w-full mt-7 bg-green-700 text-white py-3.5 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Login
        </button>

      </form>

      <div className="text-center mt-6">

        <p className="text-sm text-gray-500">

          Don't have an account?

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="ml-1 text-green-700 font-semibold hover:text-green-800"
          >
            Create account
          </button>

        </p>

      </div>

    </div>

    <p className="text-center text-xs text-gray-400 mt-6">
      Sustainable fashion. Better choices. Community swaps.
    </p>

  </div>

</main>


);
}

export default Login;
