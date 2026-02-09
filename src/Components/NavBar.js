import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "../Styles/NavBar.css";
// import useAvatar from "../hooks/useAvatar";
function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // const user = useAuth().user;
  const { avatarUrl } = useAuth();

  // console.log("NavBar user:", user);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <img
          src={avatarUrl || "https://via.placeholder.com/120?text=Avatar"}
          alt="Avatar"
          className="nav-avatar"
          onClick={() => navigate("/profile")}
        />
        <div className="logo">
          <Link to="/">InkTopia</Link>
        </div>
        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li className={location.pathname === "/home" ? "active" : ""}>
            <Link to="/home">Home</Link>
          </li>
          <li className={location.pathname === "/contactUs" ? "active" : ""}>
            <Link to="/contactUs">Contact Us</Link>
          </li>
          {user && (
            <li className={location.pathname === "/profile" ? "active" : ""}>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="btn">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
        <div
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
