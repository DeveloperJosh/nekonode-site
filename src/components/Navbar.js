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
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-yellow-500 text-xl font-bold">
            NekoNode
          </Link>
          <Link href="https://github.com/DeveloperJosh/nekonode-site" className="text-gray-300 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.599.111.82-.261.82-.579 0-.287-.01-1.046-.015-2.053-3.338.726-4.042-1.613-4.042-1.613-.546-1.387-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.834 2.808 1.304 3.492.997.108-.774.418-1.305.762-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.221-.124-.303-.535-1.521.118-3.176 0 0 1.008-.322 3.302 1.23a11.45 11.45 0 0 1 3.006-.403c1.02.005 2.048.138 3.006.403 2.294-1.553 3.302-1.23 3.302-1.23.654 1.655.243 2.873.118 3.176.77.841 1.235 1.911 1.235 3.221 0 4.61-2.807 5.623-5.479 5.92.43.37.814 1.1.814 2.22 0 1.603-.015 2.896-.015 3.293 0 .32.22.694.825.576C20.565 21.796 24 17.298 24 12 24 5.373 18.627 0 12 0z" />
            </svg>
          </Link>
        </div>
        <div className="flex-1 mx-3">
          <SearchBar />
        </div>
        <div className="flex items-center space-x-2">
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
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 rounded-lg shadow-lg mt-2">
          <Link href="/" className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">
            Home
          </Link>
          <Link href="/news" className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">
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
