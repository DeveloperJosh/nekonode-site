import Link from 'next/link';

const formatName = (anime) => {
  return anime.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '-').toLowerCase();
};

const TopAnimeList = ({ topAnime }) => {
  return (
    <section className="mb-12 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-6 text-center lg:text-left">Top 10 Anime</h2>
      <div className="grid grid-cols-1 gap-4">
        {topAnime.map((anime) => (
          <div key={anime.mal_id} className="bg-gray-700 p-2 rounded-lg shadow-lg flex items-start space-x-2">
            <img src={anime.images.jpg.image_url} alt={anime.title} className="w-16 h-24 rounded" />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">{anime.title}</h3>
              <p className="text-sm">Score: {anime.score}</p>
              <Link href={`/anime/${formatName(anime.title)}`} className="text-sm text-yellow-500 hover:text-yellow-700">
                Go to Anime
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopAnimeList;
