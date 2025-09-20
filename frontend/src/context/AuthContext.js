import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('livinglink_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('livinglink_user')) || null);

  useEffect(() => {
    if (token) localStorage.setItem('livinglink_token', token);
    else localStorage.removeItem('livinglink_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('livinglink_user', JSON.stringify(user));
    else localStorage.removeItem('livinglink_user');
  }, [user]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}