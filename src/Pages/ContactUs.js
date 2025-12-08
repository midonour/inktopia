import React, { useRef } from "react";
import "../Styles/ContactUs.css";
import emailjs from "@emailjs/browser";
function ContactUs() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_iuufj3s", "template_rfg3hbi", form.current, {
        publicKey: "qBPGm0sdOLrFBOm0-",
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
  return (
    <div className="contact-container">
      <form className="contact-form" ref={form} onSubmit={sendEmail}>
        <h1 className="contact-title">Contact Us</h1>

        <input type="text" placeholder="Name" name="name"/>
        <input type="email" placeholder="Email" name="email"/>
        <textarea placeholder="Your Message" rows={5} name="message"></textarea>

        <button type="submit" className="contact-btn">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactUs;
