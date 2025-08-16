import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(){
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <nav className="navbar container">
        <div className="brand" style={{display:'flex',alignItems:'center',gap:8}}>
          <span role="img" aria-label="building">🏢</span>
          <h1 style={{margin:0}}>LivingLink</h1>
        </div>
        <div className="navlinks">
          <Link to="/">Home</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/resident">Resident</Link>
          <Link to="/secretary">Secretary</Link>
          <Link to="/treasurer">Treasurer</Link>
          <Link to="/maintenance">Maintenance</Link>
          <Link to="/security">Security</Link>
        </div>
        <button className="menuBtn" onClick={()=>setOpen(!open)}>{open? 'Close':'Menu'}</button>
      </nav>
      {open && (
        <div className="drawer">
          <div className="container" onClick={()=>setOpen(false)}>
            <Link to="/">Home</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/resident">Resident</Link>
            <Link to="/secretary">Secretary</Link>
            <Link to="/treasurer">Treasurer</Link>
            <Link to="/maintenance">Maintenance</Link>
            <Link to="/security">Security</Link>
          </div>
        </div>
      )}
    </header>
  )
}
