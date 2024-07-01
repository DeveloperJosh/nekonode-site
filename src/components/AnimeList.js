import React from 'react';
import Link from 'next/link';

const AnimeList = ({ animes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {animes.map((anime) => (
        <Link href={`/anime/${anime.encodedName}`} key={anime.id} legacyBehavior>
          <a className="anime-card block bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 text-center">
            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-lg mb-2">
              <img src={anime.image} alt={anime.encodedName} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-gray-300 truncate">{anime.name}</h3>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default AnimeList;
