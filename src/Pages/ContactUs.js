import React,{useRef} from "react";
import "../Styles/ContactUs.css";
import emailjs from '@emailjs/browser';
function ContactUs() {
  return (
    <div className="contact-container">
      <form className="contact-form">
        <h1 className="contact-title">Contact Us</h1>

        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Your Message" rows={5}></textarea>

        <button type="submit" className="contact-btn">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactUs;
