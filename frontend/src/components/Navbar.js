import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/suggestions">Suggestions</Link>
      <Link to="/wardrobe">Wardrobe</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;
