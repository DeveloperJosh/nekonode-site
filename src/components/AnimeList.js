import React from 'react';
import Link from 'next/link';

const AnimeList = ({ animes }) => {
  const displayedAnimes = animes.slice(0, 20); // Display up to 20 animes

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-5 gap-2"> {/* Adjusted grid columns and gap */}
      {displayedAnimes.map((anime) => (
        <Link href={`/anime/${anime.encodedName}`} key={anime.name} className="block bg-gray-700 p-2 rounded-lg shadow hover:bg-gray-600 text-center"> {/* Adjusted styles */}
          <div className="relative pb-[140%] overflow-hidden rounded-lg mb-2"> {/* Adjusted padding-bottom for larger images */}
            <img
              src={anime.image}
              alt={anime.encodedName}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 className="text-sm font-bold text-gray-300 truncate">{anime.name}</h3> {/* Adjusted text size */}
          <p className="text-xs text-gray-400 mt-1 truncate">
            {anime.episode} | {anime.lang}
          </p> {/* Adjusted text size */}
        </Link>
      ))}
    </div>
  );
};

export default AnimeList;
