import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TokenContext } from "./Tokencontext";
import { jwtDecode } from "jwt-decode";// Import jwtDecode to decode the token
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateToken } = useContext(TokenContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the token in context
        updateToken(data.token);

        // Decode the token to extract user type
        const decodedToken = jwtDecode(data.token);
        const userType = decodedToken.type;        
        if (userType === 0) {
          navigate("/admin");
        } else if (userType === 1 || userType === 2) {
          navigate("/yourevents");
        } else {
          alert("Unknown user type. Contact support.");
        }        
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="loginContainer">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="loginForm">
        <div className="formGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="loginButton">
          Login
        </button>
      </form>
      <p className="signupLink">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
