import { useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;

  // stable fallback to avoid component crashes when provider isn't wired yet
  return useMemo(() => ({
    user: null,
    ready: false,
    login: async () => { throw new Error('Auth provider missing'); },
    logout: async () => {},
  }), []);
}
