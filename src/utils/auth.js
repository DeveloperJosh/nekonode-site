// src/utils/auth.js

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.href = '/auth/login';
  };
  