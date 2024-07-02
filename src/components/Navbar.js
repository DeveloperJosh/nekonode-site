import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logout } from '../utils/auth';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <nav className="bg-gray-800 p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-yellow-500 text-xl font-bold">
          NekoNode
        </Link>
        <div className="flex-1 mx-3">
          <SearchBar />
        </div>
        <div className="block md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
        <div className="hidden md:flex space-x-2">
          <Link href="/" className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">
            Home
          </Link>
          <Link href="/news" className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">
            News
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/auth/profile" className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" legacyBehavior>
                <a className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">Login</a>
              </Link>
              <Link href="/auth/register" legacyBehavior>
                <a className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">Register</a>
              </Link>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 rounded-lg shadow-lg mt-2">
          <Link href="/" className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">
            Home
          </Link>
          <Link href="/news" className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">
            News
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/auth/profile" className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block text-gray-300 hover:text-white py-2 px-4 w-full text-left border-t border-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">
                Login
              </Link>
              <Link href="/auth/register" className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
