import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bell, User } from "lucide-react";
import "./MobileNav.css";

function MobileNav() {
  const location = useLocation();

  return (
    <div className="mobile-nav sm:hidden">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        <Home size={22} />
        <span>Home</span>
      </Link>
      <Link to="/drip" className={location.pathname === "/drip" ? "active" : ""}>
        <Search size={22} />
        <span>Drip</span>
      </Link>
      <Link to="/suggestions" className={location.pathname === "/suggestions" ? "active" : ""}>
        <Search size={22} />
        <span>Suggestions</span>
      </Link>
      <Link
        to="/notifications"
        className={location.pathname === "/notifications" ? "active relative" : "relative"}
      >
        <Bell size={22} />
        <span>Alerts</span>
        {/* 🔴 Notification dot */}
        <span className="notification-dot"></span>
      </Link>
      <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
        <User size={22} />
        <span>Profile</span>
      </Link>
    </div>
  );
}

export default MobileNav;
