import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", { email, password });
  
      const { token, user } = response.data;
  
      if (!token) {
        setError("Token not received. Please try again.");
        return;
      }
  
      localStorage.setItem("token", token);
  
      console.log("Saved Token:", token);
  
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STORE_OWNER") {
        navigate("/stores");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please check your credentials.");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded mb-4 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded mb-4 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full mb-4"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate("/signup")}
          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded w-full"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Login;
