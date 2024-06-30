import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import Image from 'next/image';
import PlayerModal from '../../components/PlayerModal';
import Footer from '@/components/Footer';
const api = "https://api.nekonode.net";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const AnimePage = () => {
  const router = useRouter();
  const { name } = router.query;

  const { data: animeData, error } = useSWR(name ? `${api}/api/anime/${name}` : null, fetcher);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loadingEpisode, setLoadingEpisode] = useState(false);
  const [episodeSources, setEpisodeSources] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!name) {
      router.push('/');
    }
  }, [name, router]);

  if (router.isFallback) {
    return <div className="text-center mt-8 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Failed to load anime data</div>;
  }

  if (!animeData) {
    return <div className="text-center mt-8 text-white">Loading...</div>;
  }

  const { animeInfo, episodes } = animeData;
  const episodesPerPage = 20;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const currentEpisodes = episodes.slice((currentPage - 1) * episodesPerPage, currentPage * episodesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEpisodeSelect = async (episode) => {
    const episodeId = `${name}-episode-${episode.episodeNumber}`;
    setLoadingEpisode(true);
    if (!episodeSources[episodeId]) {
      try {
        const response = await axios.get(`${api}/api/watch/${episodeId}`);
        setEpisodeSources((prevState) => ({ ...prevState, [episodeId]: response.data }));
      } catch (error) {
        console.error('Error fetching episode sources:', error);
      }
    }
    setSelectedEpisode({ ...episode, episodeId });
    setLoadingEpisode(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEpisode(null);
  };

  const handleNextEpisode = () => {
    if (selectedEpisode && selectedEpisode.episodeNumber < episodes.length) {
      const nextEpisode = episodes.find(ep => ep.episodeNumber === selectedEpisode.episodeNumber + 1);
      handleEpisodeSelect(nextEpisode);
    }
  };

  const handlePreviousEpisode = () => {
    if (selectedEpisode && selectedEpisode.episodeNumber > 1) {
      const prevEpisode = episodes.find(ep => ep.episodeNumber === selectedEpisode.episodeNumber - 1);
      handleEpisodeSelect(prevEpisode);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
          <h1 className="text-4xl font-bold text-center mb-4 text-yellow-500">{animeInfo.title}</h1>
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative w-48 h-64 mb-6 md:mb-0 md:mr-6 flex-shrink-0">
              <Image
                src={animeInfo.image}
                alt={animeInfo.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />
            </div>
            <div className="text-gray-300 mb-6">
              <p className="mb-4"><span className="font-semibold">Description:</span> {animeInfo.description}</p>
              <p className="mb-2"><span className="font-semibold">Status:</span> {animeInfo.status}</p>
              <p className="mb-2"><span className="font-semibold">Genres:</span> {animeInfo.genres.join(', ')}</p>
              <p className="mb-2"><span className="font-semibold">Released:</span> {animeInfo.released}</p>
              <p className="mb-2"><span className="font-semibold">Total Episodes:</span> {animeInfo.totalEpisodes}</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4 text-yellow-500">Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentEpisodes.map((episode) => (
              <div key={episode.episodeNumber} className="block bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 text-center">
                <button
                  className="mt-2 bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleEpisodeSelect(episode)}
                >
                  Watch {episode.title}
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            {currentPage > 1 && (
              <button onClick={handlePreviousPage} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600">
                Previous Page
              </button>
            )}
            {currentPage < totalPages && (
              <button onClick={handleNextPage} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600">
                Next Page
              </button>
            )}
          </div>
          {selectedEpisode && (
            <PlayerModal
              isOpen={isModalOpen}
              onRequestClose={handleModalClose}
              episode={selectedEpisode}
              onPrevious={handlePreviousEpisode}
              onNext={handleNextEpisode}
              sources={episodeSources[selectedEpisode.episodeId] || []}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: {
      initialData: null, // Remove this if you don't need initial data on server-side
    },
  };
}

export default AnimePage;
