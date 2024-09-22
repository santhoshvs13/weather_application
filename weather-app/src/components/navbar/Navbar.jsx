import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // optional: create a separate CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        {/* <Link to="/trend" className="nav-link">Trends</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
