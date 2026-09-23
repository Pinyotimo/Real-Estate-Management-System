import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUser: () => {},
});

const ROLE_REDIRECT_MAP = {
  admin: '/admin',
  agent: '/agent-dashboard',
  tenant: '/tenant-dashboard',
};

// Helper utility to sync token across storage and API client
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Helper to safely extract user profile from standard API responses
const extractUserData = (responsePayload) => {
  const payload = responsePayload?.data || responsePayload;
  if (payload?.user) return payload.user;
  if (payload?.userData) return payload.userData;
  const { token, ...rest } = payload;
  return rest;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore initial authentication state from storage
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');

    if (!token) {
      if (isMounted) setLoading(false);
      return;
    }

    setAuthToken(token);

    api
      .get('/auth/me')
      .then(({ data }) => {
        if (isMounted) {
          const fetchedUser = extractUserData(data);
          setUser(fetchedUser);
        }
      })
      .catch((err) => {
        console.warn('⚠️ Token validation failed, clearing session:', err.message);
        setAuthToken(null);
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = useCallback(
    async (email, password) => {
      try {
        const { data } = await api.post('/auth/login', { email, password });
        const payload = data?.data || data;
        const token = payload?.token || data?.token;
        const userData = extractUserData(payload);

        if (token) {
          setAuthToken(token);
        }

        setUser(userData);
        const destination = ROLE_REDIRECT_MAP[userData?.role] || '/';
        navigate(destination);

        return { success: true, user: userData };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Login failed. Please verify your connection.';
        console.error('❌ Login Error:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [navigate]
  );

  // Register handler
  const register = useCallback(
    async (formData) => {
      try {
        const { data } = await api.post('/auth/register', formData);
        const payload = data?.data || data;
        const token = payload?.token || data?.token;
        const userData = extractUserData(payload);

        if (token) {
          setAuthToken(token);
        }

        setUser(userData);
        const destination = ROLE_REDIRECT_MAP[userData?.role] || '/';
        navigate(destination);

        return { success: true, user: userData };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.';
        console.error('❌ Registration Error:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [navigate]
  );

  // Logout handler
  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Memoized context payload
  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: Boolean(user),
      role: user?.role || null,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };