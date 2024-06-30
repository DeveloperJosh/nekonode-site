import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AnimeCard = ({ anime }) => {
  const animeId = anime.encodedName;
  return (
    <Link href={`/anime/${encodeURIComponent(animeId)}`} legacyBehavior>
      <a className="block border border-gray-300 p-4 m-4 text-center rounded-lg">
        <Image src={anime.image} alt={anime.name} className="w-full h-64 object-cover rounded-lg" />
        <h3 className="text-lg font-semibold mt-2">{anime.name}</h3>
        <p className="text-gray-500">{anime.lang}</p>
      </a>
    </Link>
  );
};

export default AnimeCard;
