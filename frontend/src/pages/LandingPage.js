import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/logo.png" alt="LivingLink Logo" className="logo-image" />
              <span className="logo-text">LivingLink</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#about">About</a>
              <Link to="/login" className="btn-login">Login</Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <button className="menu-toggle" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Simplify Your Community Living</h1>
              <p>LivingLink is the all-in-one platform for residential society management. Connect with neighbors, manage payments, book amenities, and more.</p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/intro-image.jpg" alt="LivingLink Image" className="hero-custom-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Powerful Features</h2>
          <p className="section-subtitle">Everything you need to manage your residential community</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Digital Notice Board</h3>
              <p>Share important announcements, events, and updates with all residents in real-time.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Payment System</h3>
              <p>Streamline maintenance fee collections and other payments with our secure platform.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Facility Booking</h3>
              <p>Reserve community amenities like party halls, sports courts, and guest rooms effortlessly.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Maintenance Requests</h3>
              <p>Submit, track, and manage maintenance issues with complete transparency.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Visitor Management</h3>
              <p>Register and monitor visitors with our secure entry management system.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Financial Transparency</h3>
              <p>Monitor society finances, expenses, and budgets with detailed reporting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2>What Residents Say</h2>
          <p className="section-subtitle">Hear from communities that use LivingLink</p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"LivingLink has transformed how our society operates. Payments are now hassle-free and communication has improved dramatically."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-details">
                  <h4>Rajesh Mehta</h4>
                  <p>Secretary, Sunshine Apartments</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The facility booking system has eliminated all conflicts and confusion. Our community events are now better organized than ever."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">P</div>
                <div className="author-details">
                  <h4>Priya Singh</h4>
                  <p>Resident, Green Valley Society</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a treasurer, the financial tracking features have saved me countless hours. The transparency has built trust within our community."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div className="author-details">
                  <h4>Arun Kumar</h4>
                  <p>Treasurer, Modern Heights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About LivingLink</h2>
              <p>LivingLink was founded in 2025 with a simple mission: to make community living more connected, efficient, and enjoyable.</p>
              <p>Our platform brings together all aspects of residential society management into one seamless experience, saving time and reducing conflicts.</p>
              <p>With features designed by residents for residents, we are trying to help communities across the country to improve their living experience.</p>
              <div className="about-stats">
                <div className="stat">
                  <h3>500+</h3>
                  <p>Communities</p>
                </div>
                <div className="stat">
                  <h3>50K+</h3>
                  <p>Residents</p>
                </div>
                <div className="stat">
                  <h3>98%</h3>
                  <p>Satisfaction Rate</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <div className="team-illustration">
                  <div className="person person-1">👩‍💼</div>
                  <div className="person person-2">👨‍💼</div>
                  <div className="person person-3">👩‍💻</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Community?</h2>
            <p>Join thousands of communities already using LivingLink to simplify their residential management.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-info">
                <div className="footer-logo">
                  <span className="logo-text">LivingLink</span>
                </div>
                <p className="footer-description">Simplifying community living through innovative technology solutions.</p>
                <div className="social-links">
                  <a href="https://www.facebook.com/share/1AwowHZh8t/" aria-label="Facebook" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/livinglink.app?igsh=M204YmpsNzNhbWh2" aria-label="Instagram" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C14.6522 2 15.4836 2.01364 16.5127 2.06273C17.5418 2.11182 18.2118 2.29455 18.7882 2.53182C19.4182 2.78909 19.9364 3.12 20.3636 3.54727C20.7909 3.97455 21.1218 4.49273 21.3791 5.12273C21.6164 5.69909 21.7991 6.36909 21.8482 7.39818C21.8973 8.42727 21.9109 9.25864 21.9109 12C21.9109 14.7414 21.8973 15.5727 21.8482 16.6018C21.7991 17.6309 21.6164 18.3009 21.3791 18.8773C21.1218 19.5073 20.7909 20.0255 20.3636 20.4527C19.9364 20.88 19.4182 21.2109 18.7882 21.4682C18.2118 21.7055 17.5418 21.8882 16.5127 21.9373C15.4836 21.9864 14.6522 22 12 22C9.34773 22 8.51636 21.9864 7.48727 21.9373C6.45818 21.8882 5.78818 21.7055 5.21182 21.4682C4.58182 21.2109 4.06364 20.88 3.63636 20.4527C3.20909 20.0255 2.87818 19.5073 2.62091 18.8773C2.38364 18.3009 2.20091 17.6309 2.15182 16.6018C2.10273 15.5727 2.08909 14.7414 2.08909 12C2.08909 9.25864 2.10273 8.42727 2.15182 7.39818C2.20091 6.36909 2.38364 5.69909 2.62091 5.12273C2.87818 4.49273 3.20909 3.97455 3.63636 3.54727C4.06364 3.12 4.58182 2.78909 5.21182 2.53182C5.78818 2.29455 6.45818 2.11182 7.48727 2.06273C8.51636 2.01364 9.34773 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.25 6.75L17.2505 6.75955" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/livinglink/" aria-label="LinkedIn" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="footer-links">
                <div className="footer-column">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><a href="#about">About</a></li>
                  </ul>
                </div>
                
                <div className="footer-column">
                  <h3>Contact Info</h3>
                  <ul className="contact-info">
                    <li>📍 Goa - India</li>
                    <li>📞 +91 7411111111</li>
                    <li>✉️ livinglink05@gmail.com</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <p>&copy; 2025 LivingLink. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}