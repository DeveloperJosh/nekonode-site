import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AnimeList = ({ animes }) => {
  // Filter out animes with episode number 0
  const filteredAnimes = animes.filter(anime => anime.episodeNumber !== 0);
  const displayedAnimes = filteredAnimes.slice(0, 20); 

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-5 gap-2">
      {displayedAnimes.map((anime) => (
        <Link href={`/anime/${anime.id}?ep=${anime.episodeNumber}`} key={anime.title} passHref>
          <div className="block bg-gray-700 p-2 rounded-lg shadow hover:bg-gray-600 hover:scale-105 transform transition-transform duration-300 text-center cursor-pointer">
            <div className="relative pb-[140%] overflow-hidden rounded-lg mb-2">
              <Image
                src={anime.image}
                alt={anime.id}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                width={300} 
                height={420}
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded-t-lg z-10">
                {anime.title.includes('Dub') ? 'Dub' : 'Sub'}
              </div>
            </div>
            <h3 className="text-sm font-bold text-gray-300 truncate">{anime.title}</h3> 
            <p className="text-xs text-gray-400 mt-1 truncate">
              Episode: {anime.episodeNumber} | {anime.title.includes('Dub') ? ' Dub' : ' Sub'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AnimeList;
