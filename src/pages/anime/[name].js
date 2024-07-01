import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import Image from 'next/image';
import ReactPlayer from 'react-player';

const api = "/api"; // Use the relative path for Next.js API
const fetcher = url => axios.get(url).then(res => res.data);

const AnimePage = () => {
  const router = useRouter();
  const { name } = router.query;
  const { data: animeData, error } = useSWR(name ? `${api}/anime/${name}` : null, fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeSources, setEpisodeSources] = useState({});
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  useEffect(() => {
    if (name) {
      fetchAndSelectEpisode(1);
    }
  }, [name]);

  const fetchAndSelectEpisode = async (episodeNumber) => {
    const episodeId = `${name}-episode-${episodeNumber}`;
    if (!episodeSources[episodeId]) {
      try {
        const response = await axios.get(`${api}/watch/${episodeId}`);
        const sources = response.data;
        setEpisodeSources(prevState => ({ ...prevState, [episodeId]: sources }));
        const defaultQuality = sources.find(source => source.quality === selectedQuality) ? selectedQuality : sources[0].quality;
        setSelectedQuality(defaultQuality);
        setSelectedEpisode({ episodeNumber, episodeId, sources });
      } catch (error) {
        console.error('Error fetching episode sources:', error);
      }
    } else {
      setSelectedEpisode({ episodeNumber, episodeId, sources: episodeSources[episodeId] });
      if (!episodeSources[episodeId].some(source => source.quality === selectedQuality)) {
        setSelectedQuality(episodeSources[episodeId][0].quality);
      }
    }
  };

  const handleEpisodeSelect = episodeNumber => fetchAndSelectEpisode(episodeNumber);
  const handlePageChange = (direction) => {
    setCurrentPage(prev => prev + direction);
  };

  if (!animeData && !error) {
    return <div className="text-center mt-8 text-white">Loading...</div>;
  }
  if (error) {
    return <div className="text-center mt-8 text-red-500">Failed to load anime data</div>;
  }

  const { animeInfo, episodes } = animeData;
  const episodesPerPage = 20;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const currentEpisodes = episodes.slice((currentPage - 1) * episodesPerPage, currentPage * episodesPerPage);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <aside className="md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">Episodes</h2>
            <div className="block md:hidden">
              <select
                className="w-full bg-gray-700 text-yellow-500 p-2 rounded"
                onChange={(e) => handleEpisodeSelect(e.target.value)}
              >
                {currentEpisodes.map(episode => (
                  <option key={episode.episodeNumber} value={episode.episodeNumber}>
                    {`EP ${episode.episodeNumber}`}
                  </option>
                ))}
              </select>
            </div>
            <ul className="hidden md:block">
              {currentEpisodes.map(episode => (
                <li key={episode.episodeNumber} className="mb-2">
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${selectedEpisode && selectedEpisode.episodeNumber === episode.episodeNumber ? 'bg-gray-700 text-yellow-500' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => handleEpisodeSelect(episode.episodeNumber)}
                  >
                    {`EP ${episode.episodeNumber}`}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button onClick={() => handlePageChange(-1)} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600" disabled={currentPage <= 1}>
                Previous
              </button>
              <button onClick={() => handlePageChange(1)} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 ml-auto" disabled={currentPage >= totalPages}>
                Next
              </button>
            </div>
          </aside>
          <main className="w-full md:w-3/4 md:ml-4">
            <EpisodePlayer episode={selectedEpisode} selectedQuality={selectedQuality} setSelectedQuality={setSelectedQuality} />
            <br />
            <AnimeDetails animeInfo={animeInfo} />
          </main>
        </div>
      </div>
    </div>
  );
};

const EpisodePlayer = ({ episode, selectedQuality, setSelectedQuality }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">Episode {episode ? episode.episodeNumber : '1'}</h2>
    <div className="player-wrapper">
      {episode ? (
        <ReactPlayer
          url={episode.sources.find(source => source.quality === selectedQuality)?.source || episode.sources[0]?.source}
          controls
          width="100%"
          height="100%"
          className="react-player"
        />
      ) : (
        <p className="text-center text-gray-300">Select an episode to play</p>
      )}
    </div>
    <div className="mt-4">
      <label htmlFor="quality-selector" className="block text-yellow-500 mb-2">Select Quality:</label>
      <select
        id="quality-selector"
        value={selectedQuality}
        onChange={(e) => setSelectedQuality(e.target.value)}
        className="bg-gray-700 text-yellow-500 p-2 rounded mb-4 w-full"
      >
        {episode && episode.sources.map(source => (
          <option key={source.quality} value={source.quality}>{source.quality}</option>
        ))}
      </select>
    </div>
  </div>
);

const AnimeDetails = ({ animeInfo }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
    <ImageWrapper image={animeInfo.image} title={animeInfo.title} />
    <div className="text-gray-300">
      <h1 className="text-4xl font-bold text-left mb-4 text-yellow-500">{animeInfo.title}</h1>
      <p className="mb-4"><span className="font-semibold">Description:</span> {animeInfo.description}</p>
      <p className="mb-2"><span className="font-semibold">Status:</span> {animeInfo.status}</p>
      <p className="mb-2"><span className="font-semibold">Genres:</span> {animeInfo.genres.join(', ')}</p>
      <p className="mb-2"><span className="font-semibold">Released:</span> {animeInfo.released}</p>
      <p className="mb-2"><span className="font-semibold">Total Episodes:</span> {animeInfo.totalEpisodes}</p>
    </div>
  </div>
);

const ImageWrapper = ({ image, title }) => (
  <div className="relative w-48 h-64 mb-6 md:mb-0 md:mr-6 flex-shrink-0">
    <Image src={image} alt={title} layout="fill" objectFit="cover" className="rounded-lg shadow-lg" placeholder="blur" blurDataURL="/placeholder.jpg" />
  </div>
);

export default AnimePage;
