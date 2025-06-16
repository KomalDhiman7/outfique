import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss'; // make this file too

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-item">Home</NavLink>
      <NavLink to="/search" className="nav-item">Search</NavLink>
      <NavLink to="/suggestions" className="nav-item">Suggestions</NavLink>
      <NavLink to="/notifications" className="nav-item">Notifications</NavLink>
      <NavLink to="/profile" className="nav-item">Profile</NavLink>
    </nav>
  );
};

export default Navbar;
