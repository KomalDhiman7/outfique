import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { supabase } from '../../supabase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Prefer Supabase session if available
        const { data: sessionData } = await supabase.auth.getSession();
        const supaUser = sessionData?.session?.user ?? null;
        if (mounted && supaUser) {
          setUser(supaUser);
        } else {
          try {
            const stored = localStorage.getItem('auth_user');
            if (stored && mounted) setUser(JSON.parse(stored));
          } catch (e) {
            console.warn('Failed to read stored auth user', e);
          }
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setReady(true);
      }
    };

    init();

    // Listen for future auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const suser = session?.user ?? null;
      setUser(suser);
    });

    return () => {
      mounted = false;
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (userObj) => {
    setUser(userObj);
    try { localStorage.setItem('auth_user', JSON.stringify(userObj)); } catch {}
  };

  const logout = async () => {
    setUser(null);
    try { localStorage.removeItem('auth_user'); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, ready, loading: !ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
