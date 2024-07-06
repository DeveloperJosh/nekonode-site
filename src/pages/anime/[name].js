import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import EpisodePlayer from '@/components/EpisodePlayer';
import { useSession } from 'next-auth/react';
import Comments from '@/components/Comments';
import CommentForm from '@/components/CommentForm';

const apiBaseUrl = "https://api-anime.sziwyz.easypanel.host/anime/gogoanime"; // Use the new API base URL

const AnimePage = () => {
  const router = useRouter();
  const { name, ep } = router.query; // Extract the 'ep' parameter from the query
  const { data: session, status: sessionStatus } = useSession(); // Rename session status to sessionStatus
  const [animeData, setAnimeData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeSources, setEpisodeSources] = useState({});
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/info/${name}`);
        setAnimeData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    if (name) {
      fetchAnimeData();
    }
  }, [name]);

  const fetchEpisodeDetails = useCallback(async (episodeNumber) => {
    const episodeId = episodeNumber === 0 ? name : `${name}-episode-${episodeNumber}`;
    try {
      const response = await axios.get(`${apiBaseUrl}/watch/${episodeId}`);
      const sources = response.data.sources;
      setEpisodeSources(prevState => ({ ...prevState, [episodeId]: { sources } }));
      const defaultQuality = sources.find(source => source.quality === '1080p') ? '1080p' : sources[0].quality;
      setSelectedQuality(defaultQuality);
      setSelectedEpisode({ episodeNumber, episodeId, sources });
    } catch (error) {
      console.error('Error fetching episode sources:', error);
    }
  }, [name]);

  const playFirstEpisode = useCallback(() => {
    if (animeData && animeData.episodes.length > 0) {
      const firstEpisode = animeData.episodes[0];
      fetchEpisodeDetails(firstEpisode.number);
      router.push({
        pathname: `/anime/${name}`,
        query: { ep: firstEpisode.number }
      }, undefined, { shallow: true });
    }
  }, [animeData, name, router, fetchEpisodeDetails]);

  useEffect(() => {
    if (name && !selectedEpisode) {
      const episodeToPlay = ep ? parseInt(ep, 10) : 1; // Use 'ep' parameter or default to 1
      if (episodeToPlay === 0) {
        playFirstEpisode(); // Play the first episode in the list if episode is 0
      } else {
        fetchEpisodeDetails(episodeToPlay);
      }
    }
  }, [name, ep, selectedEpisode, playFirstEpisode, fetchEpisodeDetails]);

  if (!animeData && !error) {
    return <div className="text-center mt-8 text-white">Loading...</div>;
  }
  if (error) {
    return <div className="text-center mt-8 text-red-500">Failed to load anime data</div>;
  }

  const { title, description, status, genres, releaseDate, totalEpisodes, image, episodes } = animeData;

  const handleEpisodeSelect = (episodeNumber) => {
    const episodeNum = parseInt(episodeNumber, 10); // Convert to number
    fetchEpisodeDetails(episodeNum);
    router.push({
      pathname: `/anime/${name}`,
      query: { ep: episodeNum }
    }, undefined, { shallow: true });
  };

  const episodeButtons = episodes.map(episode => (
    <li key={episode.number} className="mb-2">
      <button
        className={`w-full text-left px-4 py-2 rounded ${selectedEpisode && selectedEpisode.episodeNumber === episode.number ? 'bg-gray-700 text-yellow-500' : 'bg-gray-700 text-gray-300'}`}
        onClick={() => handleEpisodeSelect(episode.number)}
      >
        {`EP ${episode.number}`}
      </button>
    </li>
  ));

  const addHistory = async (name, animeId, episodeNumber) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/history/add`, {
        name,
        animeId,
        episodeNumber
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the token is correctly set
        }
      });
      console.log('History added:', response.data.message);
    } catch (error) {
      console.error('Error adding history:', error.response?.data?.error || error.message);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
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
                    {episodes.map(episode => (
                      <option key={episode.number} value={episode.number}>
                        {`EP ${episode.number}`}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className="hidden md:block">
                  {episodeButtons}
                </ul>
              </div>
            </aside>
            <main className="w-full md:w-3/4 md:ml-4">
              <div style={{ minHeight: '300px' }}>
                <EpisodePlayer
                  episode={selectedEpisode}
                  selectedQuality={selectedQuality}
                  setSelectedQuality={setSelectedQuality}
                />
              </div>
              <br />
              <AnimeDetails 
                title={title} 
                description={description} 
                status={status} 
                genres={genres} 
                releaseDate={releaseDate} 
                totalEpisodes={totalEpisodes}
                image={image}
              />
              <Comments animeId={name} episodeNumber={selectedEpisode ? selectedEpisode.episodeNumber : null} />
              {sessionStatus === 'authenticated' && <CommentForm animeId={name} episodeNumber={selectedEpisode ? selectedEpisode.episodeNumber : null} />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

const AnimeDetails = ({ title, description, status, genres, releaseDate, totalEpisodes, image }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
    <ImageWrapper image={image} title={title} />
    <div className="text-gray-300">
      <h1 className="text-4xl font-bold text-left mb-4 text-yellow-500">{title}</h1>
      <p className="mb-4"><span className="font-semibold">Description:</span> {description}</p>
      <p className="mb-2"><span className="font-semibold">Status:</span> {status}</p>
      <p className="mb-2"><span className="font-semibold">Genres:</span> {genres.join(', ')}</p>
      <p className="mb-2"><span className="font-semibold">Released:</span> {releaseDate}</p>
      <p className="mb-2"><span className="font-semibold">Total Episodes:</span> {totalEpisodes}</p>
    </div>
  </div>
);

const ImageWrapper = ({ image, title }) => (
  <div className="relative w-48 h-64 mb-6 md:mb-0 md:mr-6 flex-shrink-0">
    <Image src={image} alt={title} layout="fill" objectFit="cover" className="rounded-lg shadow-lg" placeholder="blur" blurDataURL="/placeholder.jpg" />
  </div>
);

export default AnimePage;
