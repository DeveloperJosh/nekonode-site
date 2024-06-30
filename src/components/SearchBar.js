import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center my-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for an anime..."
        className="px-4 py-2 rounded-l-lg w-1/2 bg-gray-700 text-gray-300 focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-yellow-500 text-gray-800 rounded-r-lg hover:bg-yellow-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;