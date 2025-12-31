import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
function Signup() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup - Inktopia";
    if (isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password && username && password === confirmPassword) {
      signup(username, email, password);
    } else {
      alert("Please fill all the fields");
    }
  }
  return (
    <div className="sinup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="show-password">
          <i className="fa-solid fa-eye"></i>
        </span>
        <input
          type="password"
          placeholder="confirm password"
          className="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className="show-confirm-password">
          <i className="fa-solid fa-eye"></i>
        </span>
        <button type="submit" >Signup</button>
      </form>
      <span className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </span>
    </div>
  );
}

export default Signup;
