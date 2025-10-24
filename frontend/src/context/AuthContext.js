import { createContext, useContext, useMemo } from 'react';

const AuthContext = createContext(null);

// Named hook export so callers can do: import { useAuth } from '../context/AuthContext'
export const useAuth = () => {
	// stable fallback to avoid component crashes when provider isn't wired yet
	const fallback = useMemo(() => ({
		user: null,
		ready: false,
		loading: true,
		login: async () => { throw new Error('Auth provider missing'); },
		logout: async () => {},
	}), []);

	const ctx = useContext(AuthContext);
	if (ctx) return ctx;
	return fallback;
};

export default AuthContext;
