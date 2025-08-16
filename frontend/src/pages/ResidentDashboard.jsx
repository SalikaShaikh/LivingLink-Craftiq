import React from "react";
import "./ResidentHome.css";
import "./styles.css";
import introImage from "./introImage.jpg";
import aboutImage from "./aboutImage.jpg";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook } from "react-icons/fa";

function ResidentHome() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
            <img src="/livinglink.jpg" alt="LivingLink Logo" className="logo-img" />
            <span className="logo-text">LivingLink</span>
        </div>
        <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><Link to="/signin" className="sign-in-btn">Sign In</Link></li>
        </ul>
      </nav>

      <div class="hero-section">
        <h1>Welcome to LivingLink</h1>
        <p>Connecting Residents, Services & Society in One Place</p>
        <input type="text" class="search-bar" placeholder="Search services..." />
      </div>

      {/* Intro Section */}
      <section id="home" className="intro-section">
          <div className="intro-left">
            <h2>Welcome Residents</h2>
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

      {/* Resident Services */}
      <section className="services">
        <h2>Resident Services</h2>
        <div className="service-grid">
          <div className="card">
            <h3>Notice Board</h3>
            <p>View important announcements and society updates.</p>
          </div>
          <div className="card">
            <h3>Payments</h3>
            <p>Pay your society maintenance bills online securely.</p>
          </div>
          <div className="card">
            <h3>Bookings</h3>
            <p>Book clubhouse and society amenities quickly.</p>
          </div>
          <div className="card">
            <h3>Complaints</h3>
            <p>Raise complaints and track resolution status.</p>
          </div>
          <div className="card">
            <h3>Visitor Entry</h3>
            <p>Inform guards about expected visitors in advance.</p>
          </div>
          <div className="card">
            <h3>Maintenance Staff</h3>
            <p>Contact maintenance staff for repairs and services.</p>
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

      {/* Footer */}
      <footer>
        <div className="footer-contact">
            <p><strong>Contact Us:</strong></p>
            <p>Phone: <a href="tel:+919911111111">+91 9911111111</a></p>
            <p>Address: Goa, India</p>
            <p>Email: <a href="mailto:info@livinglink05.com">info@livinglink05.com</a></p>
            
            <div className="footer-social">
                <a href="https://instagram.com/livinglink.app" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <FaInstagram size={20} />
                </a>
                <a href="https://facebook.com/profile.php?id=61579146957817" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <FaFacebook size={20} />
                </a>
            </div>
        </div>
        <div className="footer-bottom-text">
            &copy; {new Date().getFullYear()} LivingLink. All rights reserved.
            </div>
      </footer>
    </div>
  );
}

export default ResidentHome;
