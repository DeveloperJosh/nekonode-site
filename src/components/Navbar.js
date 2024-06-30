import { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-yellow-500 text-xl font-bold">NekoNode</a>
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
          <Link href="/" legacyBehavior>
             <button className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">Home</button>
          </Link>
          <Link href="/about" legacyBehavior>
              <button className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">About</button>
          </Link>
          <Link href="/contact" legacyBehavior>
              <button className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">Contact</button>
          </Link>
          <Link href="https://github.com/DeveloperJosh/anime-cli" legacyBehavior>
              <button className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600">Get NekoNode CLI</button>
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 rounded-lg shadow-lg mt-2">
          <Link href="/" legacyBehavior>
            <a className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600">Contact</a>
          </Link>
          <Link href="https://github.com/DeveloperJosh/anime-cli" legacyBehavior>
            <a className="block text-gray-300 hover:text-white py-2 px-4">Get NekoNode CLI</a>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;