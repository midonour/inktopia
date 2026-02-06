import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Signup.css";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorsMessage, setErrorsMessage] = useState(null);
  const { signup, isAuthenticated,errors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup - Inktopia";
    if (isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);
  function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setErrorsMessage("Please fill all the fields");
      return;
    }
    if(!isValidEmail(email)){
      setErrorsMessage("Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      setErrorsMessage("Passwords do not match");
      return;
    }
    if(errors){
      setErrorsMessage(errors);
      return;
    }
    signup(username, email, password);
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  function toggleShowConfirmPassword() {
    setShowConfirmPassword((prev) => !prev);
  }
  return (
    <div className="signup-container">
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

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="show-password"
            onClick={toggleShowPassword}
          >
            <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
          </span>
        </div>

        <div className="confirm-password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="show-confirm-password"
            onClick={toggleShowConfirmPassword}
          >
            <i className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
          </span>
        </div>
        {errorsMessage && <span className="error-message">{errorsMessage}</span>}
        <button type="submit">Signup</button>
      </form>

      <span className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </span>
    </div>
  );
}

export default Signup;
