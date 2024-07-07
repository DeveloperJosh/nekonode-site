import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import EpisodePlayer from '@/components/EpisodePlayer';
import { useSession } from 'next-auth/react';
import Comments from '@/components/Comments';
import CommentForm from '@/components/CommentForm';

const api = "/api"; // Use the relative path for Next.js API
const fetcher = url => axios.get(url).then(res => res.data);

const AnimePage = () => {
  const router = useRouter();
  const { name, ep } = router.query; // Extract the 'ep' parameter from the query
  const { data: animeData, error } = useSWR(name ? `${api}/anime/${name}` : null, fetcher);
  const { data: session, status } = useSession(); // Fetch the session
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeSources, setEpisodeSources] = useState({});
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedServer, setSelectedServer] = useState('gogocdn'); 

  useEffect(() => {
    if (name && animeData) {
      const firstEpisode = animeData.episodes[0]?.episodeNumber;
      const episodeToPlay = ep ? parseInt(ep, 10) : firstEpisode;
      if (episodeToPlay === 0) {
        playByAnimeName(name); // Play the anime by its name if episode is 0
      } else {
        fetchEpisodeDetails(episodeToPlay);
      }
    }
  }, [name, ep, selectedServer, animeData]);

  const fetchEpisodeDetails = async (episodeNumber) => {
    const episodeId = `${name}-episode-${episodeNumber}`;
    setSelectedEpisode({ episodeNumber, episodeId, sources: null });

    if (!episodeSources[episodeId] || episodeSources[episodeId].server !== selectedServer) { // Check for server
      try {
        const response = await axios.get(`${api}/watch/${episodeId}?server=${selectedServer}`); // Include server in API request
        const sources = response.data;
        setEpisodeSources(prevState => ({ ...prevState, [episodeId]: { sources, server: selectedServer } })); // Store server with sources
        const defaultQuality = sources.find(source => source.quality === '1080p') ? '1080p' : sources[0].quality;
        setSelectedQuality(defaultQuality);
        setSelectedEpisode(prevState => ({ ...prevState, sources }));
      } catch (error) {
        console.error('Error fetching episode sources:', error);
      }
    } else {
      setSelectedEpisode(prevState => ({ ...prevState, sources: episodeSources[episodeId].sources }));
      if (!episodeSources[episodeId].sources.some(source => source.quality === selectedQuality)) {
        setSelectedQuality(episodeSources[episodeId].sources[0].quality);
      }
    }
  };

  const playByAnimeName = async (animeName) => {
    try {
      const response = await axios.get(`${api}/watch/${animeName}`);
      const sources = response.data;
      setEpisodeSources(prevState => ({ ...prevState, [animeName]: { sources, server: selectedServer } }));
      const defaultQuality = sources.find(source => source.quality === '1080p') ? '1080p' : sources[0].quality;
      setSelectedQuality(defaultQuality);
      setSelectedEpisode({ episodeNumber: 0, episodeId: animeName, sources });
    } catch (error) {
      console.error('Error fetching anime sources:', error);
    }
  };

  const handleEpisodeSelect = episodeNumber => {
    const episodeNum = parseInt(episodeNumber, 10); // Convert to number
    if (episodeNum === 0) {
      router.push({
        pathname: `/anime/${name}`,
        query: { ep: 0 }
      }, undefined, { shallow: true });
      playByAnimeName(name);
    } else {
      router.push({
        pathname: `/anime/${name}`,
        query: { ep: episodeNum }
      }, undefined, { shallow: true });
      fetchEpisodeDetails(episodeNum);
    }
  };

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
  const episodesPerPage = 13;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const currentEpisodes = episodes.slice((currentPage - 1) * episodesPerPage, currentPage * episodesPerPage);

  const episodeButtons = currentEpisodes.map(episode => (
    <li key={episode.episodeNumber} className="mb-2">
      <button
        className={`w-full text-left px-4 py-2 rounded ${selectedEpisode && selectedEpisode.episodeNumber === episode.episodeNumber ? 'bg-gray-700 text-yellow-500' : 'bg-gray-700 text-gray-300'}`}
        onClick={() => handleEpisodeSelect(episode.episodeNumber)}
      >
        {`EP ${episode.episodeNumber}`}
      </button>
    </li>
  ));

  return (
    <>
      <Head>
        <title>{animeInfo.title}</title>
        <meta name="description" content={animeInfo.description} />
        <meta property="og:title" content={animeInfo.title} />
        <meta property="og:description" content={animeInfo.description} />
        <meta property="og:image" content={animeInfo.image} />
      </Head>
      <div className="bg-gray-900 min-h-screen text-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row">
            <aside className="md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg mb-4 md:mb-0 flex flex-col h-full">
              <div className={`flex-1 overflow-y-auto ${episodes.length > 1 ? 'max-h-96' : 'max-h-auto'}`}> {/* Adjust max height */}
                <h2 className="text-xl font-bold mb-4 text-yellow-500">Episodes</h2>
                <div className="block md:hidden">
                  <select
                    className="w-full bg-gray-700 text-yellow-500 p-2 rounded"
                    onChange={(e) => handleEpisodeSelect(parseInt(e.target.value, 10))}
                  >
                    {currentEpisodes.map(episode => (
                      <option key={episode.episodeNumber} value={episode.episodeNumber}>
                        {`EP ${episode.episodeNumber}`}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className="hidden md:block">
                  {episodeButtons}
                </ul>
              </div>
              {episodes.length > episodesPerPage && (
                <div className="flex justify-between mt-4">
                  <button onClick={() => handlePageChange(-1)} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600" disabled={currentPage <= 1}>
                    Previous
                  </button>
                  <button onClick={() => handlePageChange(1)} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 ml-auto" disabled={currentPage >= totalPages}>
                    Next
                  </button>
                </div>
              )}
            </aside>
            <main className="w-full md:w-3/4 md:ml-4">
              <div style={{ minHeight: '300px' }}>
                <EpisodePlayer
                  episode={selectedEpisode}
                  selectedQuality={selectedQuality}
                  setSelectedQuality={setSelectedQuality}
                  setSelectedServer={setSelectedServer}
                  selectedServer={selectedServer}
                />
              </div>
              <br />
              <AnimeDetails animeInfo={animeInfo} />
              <Comments animeId={name} episodeNumber={selectedEpisode ? selectedEpisode.episodeNumber : null} />
              {status === 'authenticated' && <CommentForm animeId={name} episodeNumber={selectedEpisode ? selectedEpisode.episodeNumber : null} />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

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
