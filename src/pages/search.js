// pages/search.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import dotenv from 'dotenv';

dotenv.config();
const api = process.env.API;

const SearchResults = () => {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const response = await axios.get(`${api}/api/search/${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) return <p className="text-center mt-8 text-white">Please enter a search term.</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-yellow-500">Search Results for "{query}"</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length > 0 ? (
            results.map(anime => (
              <div key={anime.encodedName} className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 text-center">
                <Image src={anime.image} alt={anime.name} width={200} height={300} className="w-full h-auto rounded-lg mb-4" />
                <h2 className="text-xl font-bold text-yellow-500 mb-2">{anime.name}</h2>
                <Link href={`/anime/${encodeURIComponent(anime.encodedName)}`} legacyBehavior>
                  <a className="mt-2 bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 inline-block">View Details</a>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No results found for "{query}".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
