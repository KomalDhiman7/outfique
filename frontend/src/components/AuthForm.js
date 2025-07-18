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
      setError('Please complete the pinky promise captcha to continue!');
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
              <PinkyPromiseCaptcha
                setCaptchaSelected={setCaptchaSelected}
                captchaSelected={captchaSelected}
              />
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

function PinkyPromiseCaptcha({ setCaptchaSelected, captchaSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 180, y: 60 });
  const leftHandPos = { x: 60, y: 60 };
  const overlapThreshold = 50;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.type.startsWith('touch')
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const mouseY = e.type.startsWith('touch')
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;
    setDragPosition({ x: mouseX - 40, y: mouseY - 40 });

    const dist = Math.sqrt(
      Math.pow(mouseX - leftHandPos.x, 2) + Math.pow(mouseY - leftHandPos.y, 2)
    );
    if (dist < overlapThreshold) {
      setCaptchaSelected('dog');
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch mobile support events
  const handleTouchStart = handleMouseDown;
  const handleTouchEnd = handleMouseUp;

  return (
    <div className="pinky-captcha-area"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleTouchEnd}
    >
      <span className="captcha-instruction">Make a pinky promise to sign up</span>
      {/* Left hand, fixed/sticky */}
      <img
        src="/pinky-swear.png"
        alt="Left hand"
        className="pinky-hand left"
        style={{ left: leftHandPos.x, top: leftHandPos.y }}
        draggable="false"
      />
      {/* Right hand, draggable */}
      <img
        src="/pinky-promise.png"
        alt="Right hand (drag me)"
        className={`pinky-hand right${isDragging ? ' dragging' : ''}${captchaSelected === 'dog' ? ' done' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          left: dragPosition.x,
          top: dragPosition.y,
          pointerEvents: captchaSelected === 'dog' ? 'none' : 'auto',
          opacity: captchaSelected === 'dog' ? 0.5 : 1
        }}
        draggable="false"
      />
      {captchaSelected === 'dog' && (
        <div className="captcha-success-msg">Pinky promise made!</div>
      )}
    </div>
  );
}

export default AuthForm;
