import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AnimeList = ({ animes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {animes.map((anime) => (
        <div key={anime.encodedName} className="bg-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-600 text-center transform transition-transform duration-200 hover:scale-105">
          <div className="relative w-full pb-[150%] mb-4">
            <Image
              src={anime.image}
              alt={anime.name}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
              unoptimized
            />
          </div>
          <h2 className="text-xl font-bold text-yellow-500 mb-2">{anime.name}</h2>
          <Link href={`/anime/${anime.encodedName}`} legacyBehavior>
            <a className="mt-2 bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 inline-block">View Details</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AnimeList;
