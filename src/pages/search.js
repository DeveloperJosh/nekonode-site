import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const SearchResults = () => {
  const router = useRouter();
  const { query, page = 1 } = router.query;
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page));
  const [hasError, setHasError] = useState(false); // State to track if there was an error

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setHasError(false); // Reset error state on new fetch
      try {
        const response = await axios.get(`/api/search/${query}?page=${currentPage}`);
        setResults(response.data.animeMatches);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]); // Clear results on error
        setHasError(true); // Set error state
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handleNextPage = () => {
    if (!hasError) { // Only navigate if there was no error on the current page
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      router.push(`/search?query=${query}&page=${nextPage}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      router.push(`/search?query=${query}&page=${previousPage}`);
    }
  };

  if (!query) return <p className="text-center mt-8 text-white">Please enter a search term.</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-4 sm:mb-0">Search Results for "{query}"</h1>
          <div className="flex space-x-2">
            {currentPage > 1 && (
              <button onClick={handlePreviousPage} className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-4 py-2 rounded">
                Go Back
              </button>
            )}
            {!hasError && (
              <button onClick={handleNextPage} className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-4 py-2 rounded">
                Next Page
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length > 0 ? results.map(anime => (
            <div key={anime.encodedName} className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 text-center">
              <Image src={anime.image} alt={anime.name} width={200} height={300} className="w-full h-auto rounded-lg mb-4" />
              <h2 className="text-xl font-bold text-yellow-500 mb-2">{anime.name}</h2>
              <Link href={`/anime/${encodeURIComponent(anime.encodedName)}`} legacyBehavior>
                <a className="mt-2 bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 inline-block">View Details</a>
              </Link>
            </div>
          )) : <p className="text-center text-gray-300">No results found for "{query}".</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
