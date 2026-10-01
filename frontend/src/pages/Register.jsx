
import { useState } from "react";
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
        location
      });

      console.log(response.data);

      alert("Registration successful");

    } catch (error) {

      console.log(error);

      alert(error.response?.data || "Registration failed");

    }
  };

  return (
    <div>

      <h1>Register</h1>

      <form onSubmit={handleRegister}>

        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

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

        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;