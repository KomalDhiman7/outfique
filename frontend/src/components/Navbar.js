import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import {
  HomeOutlined,
  CheckroomOutlined,
  LightbulbOutlined,
  NotificationsNoneOutlined,
  PersonOutline,
  SettingsOutlined,
} from "@mui/icons-material";
import "./Navbar.css";

function Navbar({ user }) {
  const { theme, toggleTheme, colors } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchUnread();
  }, []);

  async function fetchUnread() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { to: "/", label: "Home", Icon: HomeOutlined, exact: true },
    { to: "/drip", label: "Drip", Icon: CheckroomOutlined },
    { to: "/suggestions", label: "Suggestions", Icon: LightbulbOutlined },
    { to: "/notifications", label: "Notifications", Icon: NotificationsNoneOutlined, badge: unreadCount },
    { to: "/profile", label: "Profile", Icon: PersonOutline },
  ];

  return (
    <header
      className="nav-shell"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        background:
          theme === "light"
            ? "rgba(255,255,255,0.55)"
            : "rgba(22, 33, 62, 0.55)",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand">
          <div className="logo-dot" style={{ background: colors.primary }} />
          <span style={{ color: colors.text, fontWeight: 800 }}>Outfique</span>
        </div>

        {/* Links */}
        <nav className="nav-links">
          {links.map(({ to, label, Icon, exact, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={!!exact}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                color: isActive ? colors.primary : colors.textSecondary,
                backgroundColor: isActive ? `${colors.primary}1A` : "transparent",
                borderColor: isActive ? `${colors.primary}55` : colors.border,
                position: "relative",
              })}
            >
              <Icon className="nav-icon" />
              {badge > 0 && <span className="badge">{badge}</span>}
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="nav-actions" ref={menuRef}>
          {/* Theme toggle */}
          <button
            className="ghost-btn"
            title="Toggle theme"
            onClick={toggleTheme}
            style={{
              color: colors.textSecondary,
              borderColor: colors.border,
            }}
          >
            {theme === "light" ? "🌙" : "🌞"}
          </button>

          {/* Settings button */}
          <button
            className="ghost-btn relative"
            title="Settings"
            style={{ color: colors.textSecondary, borderColor: colors.border }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <SettingsOutlined />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              className="absolute right-4 top-14 w-56 rounded-xl shadow-lg bg-white dark:bg-gray-800 z-50"
            >
              <ul className="flex flex-col text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  ✏️ Edit Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  🔒 Change Password
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  👕 Manage Wardrobe
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  💡 Outfit Preferences
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  ❓ Help & FAQ
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  📩 Contact Support
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-red-500 font-semibold">
                  🚪 Logout
                </li>
              </ul>
            </div>
          )}

          {/* Avatar */}
          {user && (
            <div className="avatar-pill" style={{ borderColor: colors.border }}>
              <div className="avatar" style={{ background: colors.accent }} />
              <span className="email">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
