import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Suggestions from './pages/Suggestions';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Loader from './components/Loader';
import './styles.scss';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Router>
          <Navbar />
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
