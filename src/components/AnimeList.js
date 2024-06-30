import React from 'react';
import Link from 'next/link';

const AnimeList = ({ animes }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {animes.map((anime) => (
        <Link href={`/anime/${anime.encodedName}`} key={anime.id} legacyBehavior>
          <a className="anime-card block bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 text-center">
            <div className="w-full h-96 overflow-hidden rounded-lg mb-2">
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
