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

      navigate("/");

      alert("Login successful");

    } catch (error) {

      console.log(error);

      alert(error.response?.data || "Login failed");

    }
  };

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <div>

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </div>

        <br />

        <div>

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
        </div>

        <br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;