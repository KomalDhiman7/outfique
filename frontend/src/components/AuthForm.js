import React, { useState } from 'react';
import supabase from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

function AuthForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaSelected, setCaptchaSelected] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLogin = type === 'login';

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && captchaSelected !== 'dog') {
      setError('Please select the pet dog to continue!');
      return;
    }

    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      if (result.error.message.includes('User already registered')) {
        setError('You already signed up. Please login instead.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error.message);
      }
    } else {
      navigate('/');
    }
  };

  const handleGoogleAuth = () => {
    alert('Currently unavailable, please sign up manually.');
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Welcome back 👋' : 'Join Outfique 💖'}</h2>

        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />

          {!isLogin && (
            <>
              <p className="captcha-instruction">Tap the pet dog to prove you’re human:</p>
              <div className="captcha-grid">
                <div
                  className={`captcha-card ${captchaSelected === 'dog' ? 'selected' : ''}`}
                  onClick={() => setCaptchaSelected('dog')}
                >
                  <img src="https://i.imgur.com/YC4kNdV.jpg" alt="pet dog" />
                </div>
                <div
                  className={`captcha-card ${captchaSelected === 'pinky' ? 'selected' : ''}`}
                  onClick={() => setCaptchaSelected('pinky')}
                >
                  <img src="https://i.imgur.com/pinky-promise.jpg" alt="pinky promise" />
                </div>
              </div>
            </>
          )}

          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>

          {error && <p className="error">{error}</p>}
        </form>

        <div className="switch-link">
          {isLogin ? (
            <p>New here? <Link to="/signup">Signup</Link></p>
          ) : (
            <p>Already a user? <Link to="/login">Login</Link></p>
          )}
        </div>

        <div className="divider">OR</div>
        <button className="google-btn" onClick={handleGoogleAuth}>
          {isLogin ? 'Login' : 'Signup'} with Google
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
