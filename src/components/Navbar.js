import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-yellow-500 text-2xl font-bold">NekoNode</a>
        </Link>
        <div className="block md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link href="/" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-gray-300 hover:text-white">About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Contact</a>
          </Link>
          <Link href="https://github.com/DeveloperJosh/anime-cli" legacyBehavior>
            <a className="text-gray-300 hover:text-white">Get NekoNode CLI</a>
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
