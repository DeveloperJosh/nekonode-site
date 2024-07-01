import React from 'react';
import AnimeList from '../components/AnimeList';

const api = "https://api.nekonode.net";

const HomePage = ({ latestAnime, page }) => (
  <div className="bg-gray-900 min-h-screen text-gray-200">
    <div className="container mx-auto px-4 sm:px-2 py-8">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-4 sm:mb-0">Recently Updated</h1>
          <div className="flex space-x-2">
            {page > 1 && (
              <a
                href={`/?page=${page - 1}`}
                className="bg-yellow-500 text-gray-800 px-3 py-1 rounded hover:bg-yellow-600"
              >
                Previous Page
              </a>
            )}
            <a
              href={`/?page=${page + 1}`}
              className="bg-yellow-500 text-gray-800 px-3 py-1 rounded hover:bg-yellow-600"
            >
              Next Page
            </a>
          </div>
        </div>
        <AnimeList animes={latestAnime} />
      </div>
    </div>
  </div>
);

export async function getServerSideProps({ query }) {
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
