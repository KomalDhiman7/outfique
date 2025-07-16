import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import './Navbar.css';

function Navbar({ user }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/suggestions">Suggestions</Link>
      <Link to="/wardrobe">Wardrobe</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '🌞 Light Mode'}
      </button>
      {user && <span className="user-email">{user.email}</span>}
    </nav>
  );
}

export default Navbar;
