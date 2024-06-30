import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import AnimeList from '../components/AnimeList';
import Footer from '../components/Footer';
import dotenv from 'dotenv';

dotenv.config();
const api = process.env.API;

const HomePage = ({ latestAnime, page }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <SearchBar />
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4 overflow-auto scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700">
          <div className="text-center mb-4 flex justify-between items-center">
            {page > 1 && (
              <a
                href={`/?page=${page - 1}`}
                className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600"
              >
                Previous Page
              </a>
            )}

            <a
              href={`/?page=${page + 1}`}
              className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600"
            >
              Next Page
            </a>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4 text-yellow-500">Latest Anime</h1>
          <AnimeList animes={latestAnime} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const page = query.page ? parseInt(query.page, 10) : 1;

  const res = await fetch(`${api}/api/latest?page=${page}`);
  const latestAnime = await res.json();

  return {
    props: {
      latestAnime,
      page,
    },
  };
}

export default HomePage;
