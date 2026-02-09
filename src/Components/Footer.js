import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/footer.css"
function Footer() {
    return (
         <footer>
    <div className="footerContainer">
        <div className="socialIcons">
            <a href="https://www.facebook.com/mohamednour.alkhtib"><i className="fa-brands fa-facebook"></i></a>
            <a href="http://instagram.com/mohamednouralkhtib/"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://x.com/midonour2311"><i className="fa-brands fa-twitter"></i></a>
            <a href="https://github.com/midonour"><i className="fa-brands fa-github"></i></a>
            <a href="https://www.linkedin.com/in/mohamed-nour-2996102a7/"><i className="fa-brands fa-linkedin-in"></i></a>
        </div>
        <div className="footerNav">
            <ul><li><Link to="/">Home</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
            </ul>
        </div>
        
    </div>
    <div className="footerBottom">
        <p>Copyright &copy;2026; Designed by <span className="designer">Mohamed Nour</span></p>
    </div>
</footer>
    )
}

export default Footer
