import { useEffect, useState } from "react";
import "../Styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { Link } from "react-router-dom";
function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { login, isAuthenticated, errors } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login - Inktopia";
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
    else alert("Please fill all the fields");
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  console.log("Login errors:", errors);
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Welcom Back!</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="show-password-login" onClick={toggleShowPassword}>
          <i
            className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
          ></i>
        </span>
        <span className="error">{errors}</span>
        <button type="submit">Login</button>
      </form>
      <span className="register-link">
        Don't have an account? <Link to="/signup">Signup</Link>
      </span>
    </div>
  );
}

export default Login;
