import React from 'react';
import './App.css';
import Complaints from './Complaints';
import VisitorLog from './VisitorLog';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Security Guard Dashboard</h1>
      </header>

      <main className="main-content">
        <section className="section" id="complaints">
          <Complaints />
        </section>

        <section className="section" id="visitor-log">
          <VisitorLog />
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Security Management System</p>
      </footer>
    </div>
  );
}

export default App;
