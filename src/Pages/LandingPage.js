import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/LandingPage.css"
function LandingPage() {
    return (
        <div className="landing-hero">
        <h2>Welcome to InkTopia</h2>
        <p>Your ultimate destination for reading and downloading books.</p>
        <Link to="/home" className="cta-btn">Explore Now</Link>
      </div>
    )
}

export default LandingPage
