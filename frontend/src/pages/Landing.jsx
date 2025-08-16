// Landing.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles.css"; // Your CSS file
import logo from "./logo.png";
import introImage from "./introImage.jpg";
import aboutImage from "./aboutImage.jpg";

function Landing() {
  return (
    <div className="App">
      <header>
        <div className="header-left">
          <img src={logo} alt="LivingLink Logo" className="logo" />
          <h1>LivingLink</h1>
        </div>
        <div className="header-nav">
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
        </div>
        <Link to="/signin" className="sign-in-btn">Sign In</Link>
      </header>

      <main>
        <section id="home" className="intro-section">
          <div className="intro-left">
            <h2>Welcome</h2>
            <p>
              LivingLink is your all in one residential society management platform. LivingLink is designed to simplify daily life for residents and streamline society operations for management staff. Residents can receive important notices, pay dues online, book clubhouses, raise complaints anonymously, and track the status of their requests, all from a single, easy-to-use platform.
            </p>
            <p>
              For society staff, LivingLink ensures transparency and efficiency. Secretaries can monitor complaints and dues, treasurers can manage finances and budgets, maintenance staff can handle work requests, and security personnel can track visitor logs and monitor entries. With personalized dashboards for each user, LivingLink connects your community, reduces paperwork, and makes society management smoother than ever.
            </p>
          </div>
          <div className="intro-right">
            <img src={introImage} alt="Intro Image" className="intro-image" />
          </div>
        </section>

        <section id="services" className="services-section">
          <h2>Offered Services</h2>
          <div className="services-list">
            <div className="service-item">
              <h3>Payment</h3>
              <p>Easy and secure online payments for all your needs.</p>
            </div>
            <div className="service-item">
              <h3>Clubhouse Booking</h3>
              <p>Book clubhouse facilities quickly and conveniently.</p>
            </div>
            <div className="service-item">
              <h3>Visitor Log</h3>
              <p>Track and manage visitors efficiently.</p>
            </div>
            <div className="service-item">
              <h3>Raise Complaints</h3>
              <p>Report issues and get timely resolutions.</p>
            </div>
            <div className="service-item">
              <h3>Join to Know More Features</h3>
              <p>Become a member to explore additional features!</p>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="about-left">
            <img src={aboutImage} alt="About LivingLink" className="about-image" />
          </div>
          <div className="about-right">
            <h2>About Us</h2>
            <p>
              LivingLink is dedicated to connecting communities and simplifying everyday tasks. 
              Our platform offers secure payments, easy clubhouse bookings, efficient visitor management, and more. 
              We strive to make life easier and better for everyone. Join us to experience seamless services and a vibrant community!
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-contact">
          <p><strong>Contact Us:</strong></p>
          <p>Phone: <a href="tel:+919911111111">+91 9911111111</a></p>
          <p>Address: Goa, India</p>
          <p>Email: <a href="mailto:info@livinglink.com">info@livinglink05.com</a></p>
          <div className="footer-social">
            <a href="https://instagram.com/livinglink.app" target="_blank" rel="noopener noreferrer" className="social-icon instagram">Instagram</a>
            <a href="https://facebook.com/profile.php?id=61579146957817" target="_blank" rel="noopener noreferrer" className="social-icon facebook">Facebook</a>
          </div>
        </div>
        <p>&copy; 2025 LivingLink</p>
      </footer>
    </div>
  );
}

export default Landing;
