// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Drip from './pages/Drip'; // ✅ new page
import Suggestions from './pages/Suggestions';
import Wardrobe from './pages/Wardrobe';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider } from './ThemeContext';
import { supabase } from './supabase';
import './App.css';

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
                <Route path="/drip" element={<Drip />} />  {/* ✅ new drip tab (2nd place) */}
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/wardrobe" element={<Wardrobe />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
