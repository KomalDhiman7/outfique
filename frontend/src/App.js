// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Drip from "./pages/Drip";
import Suggestions from "./pages/Suggestions";
import Wardrobe from "./pages/Wardrobe";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeProvider } from "./ThemeContext";
import { supabase } from "./supabase";
import './components/MobileNav.css';

import "./App.css";

// ✅ Import icons + Link for bottom nav
import { Home as HomeIcon, Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Define MobileNav here (no duplicate import)
function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0d1450] border-t border-gray-700 sm:hidden flex justify-around py-2 z-50">
      <Link to="/" className="flex flex-col items-center text-white hover:text-blue-400">
        <HomeIcon size={22} />
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/drip" className="flex flex-col items-center text-white hover:text-blue-400">
        <Search size={22} />
        <span className="text-xs">Drip</span>
      </Link>
      <Link
        to="/notifications"
        className="relative flex flex-col items-center text-white hover:text-blue-400"
      >
        <Bell size={22} />
        <span className="text-xs">Alerts</span>
        <span className="absolute top-0 right-2 h-2 w-2 rounded-full bg-red-500"></span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-white hover:text-blue-400">
        <User size={22} />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider>
      <Router>
        {user && <Navbar user={user} />}
        <div className="main-content">
          <div className="app-bg" />
          <Routes>
            {!user ? (
              <>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/signup" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/drip" element={<Drip />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/wardrobe" element={<Wardrobe />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>

        {/* ✅ Show bottom nav only when logged in */}
        {user && <MobileNav />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
