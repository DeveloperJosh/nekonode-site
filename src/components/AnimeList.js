import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AnimeList = ({ animes }) => {
  const displayedAnimes = animes.slice(0, 20); 

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-5 gap-2"> {/* Adjusted grid columns and gap */}
      {displayedAnimes.map((anime) => (
        <Link href={`/anime/${anime.id}?ep=${anime.episodeNumber}`} key={anime.title} className="block bg-gray-700 p-2 rounded-lg shadow hover:bg-gray-600 text-center"> {/* Adjusted styles */}
          <div className="relative pb-[140%] overflow-hidden rounded-lg mb-2"> {/* Adjusted padding-bottom for larger images */}
            <Image
              src={anime.image}
              alt={anime.encodedName}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              width={300} 
              height={420}
            />
          </div>
          <h3 className="text-sm font-bold text-gray-300 truncate">{anime.title}</h3> 
          <p className="text-xs text-gray-400 mt-1 truncate">
            Episode: {anime.episodeNumber} | {anime.title.includes('Dub') ? ' Dub' : ' Sub'}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default AnimeList;
