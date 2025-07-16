import React, { useState } from 'react';
import supabase from '../supabase';
import { useNavigate } from 'react-router-dom';

function AuthForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isLogin = type === 'login';

  const handleAuth = async (e) => {
    e.preventDefault();
    let result;

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        <button type="button" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default AuthForm;
