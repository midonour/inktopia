// import "../Styles/NavBar.css";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../Contexts/AuthContext";

// function NavBar() {
//   const { isAuthenticated, logout, user } = useAuth();
//   const navigate = useNavigate();

//   async function handleLogout() {
//     try {
//       await logout();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   }
//   return (
//     <div className="navbar">
//       <h2>InkTopia</h2>
//       <div className="nav-links">
//         <Link to="/home">Home</Link>
//         <Link to="/contactUs">Contact Us</Link>
//         <Link to="/admin">Admin</Link>
//         {isAuthenticated ? (
//           <button onClick={handleLogout} className="btn">
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/signup">Signup</Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// export default NavBar;

// import "../Styles/NavBar.css";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../Contexts/AuthContext";

// function NavBar() {
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   async function handleLogout() {
//     try {
//       await logout();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   }

//   return (
//     <div className="navbar">
//       <h2>
//         <Link to="/">InkTopia</Link>
//       </h2>
//       <div className="nav-links">
//         <Link to="/home">Home</Link>
//         <Link to="/contactUs">Contact Us</Link>
//         <Link to="/admin">Admin</Link>
//         {isAuthenticated ? (
//           <button onClick={handleLogout} className="btn">
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/signup">Signup</Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NavBar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "../Styles/NavBar.css";

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <li className={location.pathname === "/admin" ? "active" : ""}>
            <Link to="/admin">Admin</Link>
          </li>
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
