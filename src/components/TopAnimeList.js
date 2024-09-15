import Link from 'next/link';
import Image from 'next/image';

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const TopAnimeList = ({ topAnime }) => {
  return (
    <section className="mb-12 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-6 text-center lg:text-left">Top 10 Anime</h2>
      <div className="grid grid-cols-1 gap-4">
        {topAnime.map((anime) => (
          <Link href={`/anime/${anime.id}`} passHref key={anime.id}>
            <div className="bg-gray-700 p-2 rounded-lg shadow-lg flex items-start space-x-2 cursor-pointer transform transition-transform duration-300 hover:bg-gray-600 hover:scale-105">
              <Image 
                src={anime.image} 
                alt={anime.title} 
                className="w-16 h-24 rounded" 
                width={64} 
                height={96} 
              />
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl text-gray-300 font-bold">{truncateText(anime.title, 30)}</h3>
                <p className="text-gray-300">Episode: {anime.episodeNumber}</p>
                <p className="text-gray-300">Language: {anime.title.includes('Dub') ? ' Dub' : ' Sub'}</p>
                <p className="text-gray-300">Watch Now</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopAnimeList;
