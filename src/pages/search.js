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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setHasError(false);
      try {
        const response = await axios.get(`/api/search/${query}?page=${currentPage}`);
        setResults(response.data.animeMatches);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
        setHasError(true);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handleNextPage = () => {
    if (!hasError) {
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
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-4 sm:mb-0">Search Results for "{query}"</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.length > 0 ? (
            results.map((anime) => (
              <Link href={`/anime/${encodeURIComponent(anime.encodedName)}`} key={anime.encodedName} legacyBehavior>
                <a className="block bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition">
                  <div className="relative w-full pb-[150%] mb-4">
                    <Image
                      src={anime.image}
                      alt={anime.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-yellow-500 mb-2">{anime.name}</h2>
                </a>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-300">No results found for "{query}".</p>
          )}
        </div>
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className={`bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-4 py-2 rounded-lg shadow transition ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous Page
          </button>
          <span className="text-lg font-bold text-gray-300 mx-4">Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={hasError}
            className={`bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-4 py-2 rounded-lg shadow transition ${hasError ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
