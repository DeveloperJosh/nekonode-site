// pages/login.js
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-6 text-center">Login to Your Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-yellow-500 text-gray-800 px-4 py-2 font-bold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Login
            </button>
            <Link href="/auth/request-reset" className="text-yellow-500 hover:text-yellow-600">
              Forgot Password?
            </Link>
          </div>
        </form>
        <p className="mt-6 text-center">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-yellow-500 hover:text-yellow-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
