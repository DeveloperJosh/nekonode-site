import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import EpisodePlayer from '@/components/EpisodePlayer';
import { useSession } from 'next-auth/react';
import Comments from '@/components/Comments';
import CommentForm from '@/components/CommentForm';
import AddToListModal from '@/components/AddToListModal';

const api = "/api"; // Use the relative path for Next.js API
const fetcher = url => axios.get(url).then(res => res.data);

const AnimePage = () => {
  const router = useRouter();
  const { name, ep } = router.query;
  const { data: animeData, error } = useSWR(name ? `${api}/anime/${name}` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedServer, setSelectedServer] = useState('gogocdn');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [okMessage, setOkMessage] = useState('');

  const fetchEpisodeDetails = useCallback((episode) => {
    const { episodeNumber, id } = episode;
    setSelectedEpisode({
      episodeNumber,
      episodeId: id,
      animeId: name,
      sources: [{ quality: selectedQuality }]
    });
  }, [name, selectedQuality]);

  useEffect(() => {
    if (name && animeData) {
      const firstEpisode = animeData.episodes[0];
      const episodeToPlay = ep ? animeData.episodes.find(e => e.episodeNumber === parseInt(ep, 10)) : firstEpisode;
      fetchEpisodeDetails(episodeToPlay);
    }
  }, [name, ep, animeData, fetchEpisodeDetails]);

  const handleEpisodeSelect = episodeNumber => {
    const episode = animeData.episodes.find(e => e.episodeNumber === parseInt(episodeNumber, 10));
    router.push({
      pathname: `/anime/${name}`,
      query: { ep: episodeNumber }
    }, undefined, { shallow: true });
    fetchEpisodeDetails(episode);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prev => prev + direction);
  };

  const handleAddToAnimeList = async ({ status }) => {
    if (session) {
      try {
        const deurl = decodeURIComponent(name);
        let anime_name = deurl.replace(/-/g, ' ');
        anime_name = anime_name.replace(/\b\w/g, l => l.toUpperCase());
        const response = await axios.post(`${api}/animelist/add`, {
          name: anime_name,
          animeId: name,
          image: animeData.animeInfo.image,
          status,
          lastWatchedAt: new Date(),
        });
        if (response.status === 200) {
          setOkMessage('Anime added to your list successfully!');
        }
      } catch (error) {
        setErrorMessage('Failed to add anime to your list');
      }
    } else {
      setErrorMessage('You need to be logged in to add an anime to your list');
    }
  };

  if (!animeData && !error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
        <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Your Anime adventure is about to begin</p>
      </div>
    );
  }
  if (error) {
    return <div className="text-center mt-8 text-red-500">Failed to load anime data</div>;
  }

  const { animeInfo, episodes } = animeData;
  const episodesPerPage = 13;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const currentEpisodes = episodes.slice((currentPage - 1) * episodesPerPage, currentPage * episodesPerPage);

  const episodeButtons = currentEpisodes.map(episode => (
    <li key={`${episode.id}-${episode.episodeNumber}`} className="mb-2">
      <button
        className={`w-full text-left px-4 py-2 rounded ${selectedEpisode && selectedEpisode.episodeNumber === episode.episodeNumber ? 'bg-gray-700 text-yellow-500' : 'bg-gray-700 text-gray-300'}`}
        onClick={() => handleEpisodeSelect(episode.episodeNumber)}
      >
        {episode.title}
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
                      <option key={`${episode.id}-${episode.episodeNumber}`} value={episode.episodeNumber}>
                        {episode.title}
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
                    &#10094;
                  </button>
                  <button onClick={() => handlePageChange(1)} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 ml-auto" disabled={currentPage >= totalPages}>
                    &#10095;
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
              <AnimeDetails animeInfo={animeInfo} onAddToListClick={() => setIsModalOpen(true)} isAuthenticated={!!session} />
              <Comments animeId={name} episodeNumber={selectedEpisode ? selectedEpisode.episodeNumber : null} />
              {session && <CommentForm animeId={name} episodeNumber={selectedEpisode ? selectedEpisode.episodeNumber : null} />}
            </main>
          </div>
        </div>
        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              className="ml-4 text-white font-bold"
            >
              &times;
            </button>
          </div>
        )}
       {okMessage && ( 
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center">
          <span>{okMessage}</span>
          <button
            onClick={() => setOkMessage('')}
            className="ml-4 text-white font-bold"
          >
            &times;
          </button>
        </div>
       )}
      </div>
      <AddToListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddToAnimeList}
      />
    </>
  );
};

const AnimeDetails = ({ animeInfo, onAddToListClick, isAuthenticated }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
    <ImageWrapper image={animeInfo.image} title={animeInfo.title} />
    <div className="text-gray-300 mt-4 md:mt-0 md:ml-4">
      <h1 className="text-4xl font-bold text-left mb-4 text-yellow-500">{animeInfo.title}</h1>
      <p className="mb-4"><span className="font-semibold">Description:</span> {animeInfo.description}</p>
      <p className="mb-2"><span className="font-semibold">Status:</span> {animeInfo.status}</p>
      <p className="mb-2"><span className="font-semibold">Genres:</span> {animeInfo.genres.join(', ')}</p>
      <p className="mb-2"><span className="font-semibold">Released:</span> {animeInfo.released}</p>
      <p className="mb-2"><span className="font-semibold">Total Episodes:</span> {animeInfo.totalEpisodes}</p>
      {isAuthenticated && (
        <button
          onClick={onAddToListClick}
          className="mt-2 bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600"
        >
          Add to My List
        </button>
      )}
    </div>
  </div>
);

const ImageWrapper = ({ image, title }) => (
  <div className="relative w-48 h-64 flex-shrink-0">
    <Image
      src={image}
      alt={title}
      fill
      sizes="100vw"
      style={{ objectFit: 'cover' }}
      className="rounded-lg shadow-lg"
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
    />
  </div>
);

export default AnimePage;
