import { useEffect, useState } from "react";
import "../Styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { Link } from "react-router-dom";
function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { login, isAuthenticated } = useAuth();
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
          type="password"
          placeholder="Password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="show-password">
          <i className="fa-solid fa-eye"></i>
        </span>
        <button type="submit">Login</button>
      </form>
      <span className="register-link">
        Don't have an account? <Link to="/signup">Signup</Link>
      </span>
    </div>
  );
}

export default Login;
