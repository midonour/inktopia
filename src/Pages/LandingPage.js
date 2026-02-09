import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/LandingPage.css"
import { useAuth } from '../Contexts/AuthContext'
function LandingPage() {
    const { user } = useAuth();
    return (
        <div className="landing-hero">
        <h2>Welcome to InkTopia</h2>
        <p>Your ultimate destination for reading and downloading books.</p>
        <Link to={user ? "/home" : "/login" } className="cta-btn">Explore Now</Link>
      </div>
    )
}

export default LandingPage
