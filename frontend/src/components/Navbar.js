// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import {
  HomeOutlined,
  CheckroomOutlined,   // ✅ Drip (wardrobe/clothing-like icon)
  LightbulbOutlined,
  NotificationsNoneOutlined,
  PersonOutline,
  SettingsOutlined,
} from '@mui/icons-material';
import './Navbar.css';

function Navbar({ user }) {
  const { theme, toggleTheme, colors } = useTheme();

  // ✅ Updated links: removed Search, added Drip (2nd place)
  const links = [
    { to: '/', label: 'Home', Icon: HomeOutlined, exact: true },
    { to: '/drip', label: 'Drip', Icon: CheckroomOutlined },
    { to: '/suggestions', label: 'Suggestions', Icon: LightbulbOutlined },
    { to: '/notifications', label: 'Notifications', Icon: NotificationsNoneOutlined },
    { to: '/profile', label: 'Profile', Icon: PersonOutline },
  ];

  return (
    <header
      className="nav-shell"
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background:
          theme === 'light'
            ? 'rgba(255,255,255,0.55)'
            : 'rgba(22, 33, 62, 0.55)',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className="nav-inner">
        <div className="brand">
          <div className="logo-dot" style={{ background: colors.primary }} />
          <span style={{ color: colors.text, fontWeight: 800 }}>Outfique</span>
        </div>

        <nav className="nav-links">
          {links.map(({ to, label, Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={!!exact}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? colors.primary : colors.textSecondary,
                backgroundColor: isActive ? `${colors.primary}1A` : 'transparent',
                borderColor: isActive ? `${colors.primary}55` : colors.border,
              })}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="ghost-btn"
            title="Toggle theme"
            onClick={toggleTheme}
            style={{
              color: colors.textSecondary,
              borderColor: colors.border,
            }}
          >
            {theme === 'light' ? '🌙' : '🌞'}
          </button>

          <NavLink
            to="/settings"
            className="ghost-btn"
            title="Settings"
            style={{ color: colors.textSecondary, borderColor: colors.border }}
          >
            <SettingsOutlined />
          </NavLink>

          {user && (
            <div className="avatar-pill" style={{ borderColor: colors.border }}>
              <div className="avatar" style={{ background: colors.accent }} />
              <span className="email">{user.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-dock">
        {links.map(({ to, label, Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={!!exact}
            className={({ isActive }) =>
              `dock-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="dock-icon" />
            <span className="dock-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
