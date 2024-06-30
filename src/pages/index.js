import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import AnimeList from '../components/AnimeList';
import axios from 'axios';

const HomePage = () => {
  const [latestAnime, setLatestAnime] = useState([]);

  useEffect(() => {
    const fetchLatestAnime = async () => {
      try {
        const response = await axios.get('https://api.nekonode.net/api/latest');
        setLatestAnime(response.data);
      } catch (error) {
        console.error('Error fetching latest anime:', error);
      }
    };

    fetchLatestAnime();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4 overflow-auto scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700">
          <h1 className="text-4xl font-bold text-center mb-4 text-yellow-500">Latest Anime</h1>
          <AnimeList animes={latestAnime} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
