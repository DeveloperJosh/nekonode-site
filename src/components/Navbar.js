import { useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut();
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
          <Link href="https://discord.gg/88ArBFRcY8" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.518.074.074 0 00-.078.037c-.209.374-.441.864-.606 1.249-1.844-.276-3.68-.276-5.522 0-.165-.393-.405-.875-.616-1.249a.077.077 0 00-.078-.037c-1.676.318-3.344.838-4.885 1.518a.07.07 0 00-.032.028C.533 9.292-.319 14.068.099 18.783a.084.084 0 00.031.057 19.876 19.876 0 004.885 2.495.078.078 0 00.084-.028c.378-.518.715-1.065 1.007-1.635a.077.077 0 00-.041-.106 15.153 15.153 0 01-2.181-1.026.077.077 0 01-.008-.127c.147-.111.294-.222.431-.343a.074.074 0 01.078-.01c4.584 2.105 9.537 2.105 14.093 0a.074.074 0 01.079.01c.137.121.283.232.43.343a.077.077 0 01-.007.127c-.698.416-1.43.748-2.181 1.026a.077.077 0 00-.041.106c.304.57.641 1.117 1.007 1.635a.078.078 0 00.084.028 19.933 19.933 0 004.885-2.495.078.078 0 00.031-.057c.505-5.19-.895-9.913-5.318-14.386a.07.07 0 00-.032-.028zM8.02 15.331c-1.184 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.204 0 2.169 1.086 2.156 2.419 0 1.334-.955 2.419-2.156 2.419zm7.973 0c-1.184 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.204 0 2.169 1.086 2.156 2.419 0 1.334-.955 2.419-2.156 2.419z" />
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
            {status === "authenticated" ? (
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
                <button
                  onClick={() => signIn('discord')}
                  className="bg-yellow-500 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-yellow-600"
                >
                  Login with Discord
                </button>
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
          {status === "authenticated" ? (
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
              <button
                onClick={() => signIn('discord')}
                className="block text-gray-300 hover:text-white py-2 px-4 border-b border-gray-600"
              >
                Login with Discord
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
