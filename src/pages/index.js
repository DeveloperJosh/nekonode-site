import React, { useState } from 'react';
import Link from 'next/link';
import AnimeList from '../components/AnimeList';
import Timetable from '../components/Timetable';
import TopAnimeList from '../components/TopAnimeList';
import axios from 'axios';
import { getNewsPosts } from '../lib/news';

const HomePage = ({ initialLatestAnime, topAnime, initialPage, newsPosts }) => {
  const [latestAnime, setLatestAnime] = useState(initialLatestAnime);
  const [page, setPage] = useState(initialPage);

  const handlePagination = async (newPage) => {
    try {
      const response = await axios.get(`/api/latest`, {
        params: { page: newPage, limit: 12 },
      });
      setLatestAnime(response.data);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching latest episodes:', error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 sm:px-2 py-8 flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 lg:w-2/3 lg:mr-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-4 sm:mb-0">
                Recently Updated
              </h1>
              <div className="flex space-x-2">
                {page > 1 && (
                  <button
                    onClick={() => handlePagination(page - 1)}
                    className="bg-yellow-500 text-gray-800 px-4 py-2 text-lg sm:text-xl rounded hover:bg-yellow-600"
                  >
                    Previous Page
                  </button>
                )}
                <button
                  onClick={() => handlePagination(page + 1)}
                  className="bg-yellow-500 text-gray-800 px-4 py-2 text-lg sm:text-xl rounded hover:bg-yellow-600"
                >
                  Next Page
                </button>
              </div>
            </div>
            <AnimeList animes={latestAnime} />
          </div>
          <Timetable />
        </div>
        <br />
        <div className="w-full lg:w-1/3 lg:ml-4">
          <TopAnimeList topAnime={topAnime} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const initialPage = query.page ? parseInt(query.page, 10) : 1;

  // Fetch the latest episodes from the API
  let latestAnime = [];
  try {
    const latestResponse = await axios.get(`http://localhost:3000/api/latest`, {
      params: { page: initialPage, limit: 12 },
    });
    latestAnime = latestResponse.data;
  } catch (error) {
    console.error('Error fetching latest episodes:', error);
  }

  let topAnime = [];
  try {
    const topAnimeResponse = await axios.get(`http://localhost:3000/api/top10`);
    topAnime = topAnimeResponse.data.results;
  } catch (error) {
    console.error('Error fetching top anime:', error);
  }

  const newsPosts = getNewsPosts();

  return {
    props: {
      initialLatestAnime: latestAnime || [],
      topAnime: topAnime || [],
      initialPage,
      newsPosts,
    },
  };
}

export default HomePage;
