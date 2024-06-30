import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ReactPlayer from 'react-player';

const EpisodePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      console.log(`https://api.nekonode.net/api/watch/${id}`);
      const response = await axios.get(`https://api.nekonode.net/api/watch/${id}`);
      setSources(response.data);
    };

    if (id) fetchSources();
  }, [id]);

  if (sources.length === 0) return <p>Loading...</p>;

  // Filter the sources to find the 1080p link
  const source1080p = sources.find(source => source.quality === '1080p');

  const getEpisodeNumber = (id) => {
    const match = id.match(/episode-(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const animeName = id.split('-episode-')[0];
  const episodeNumber = getEpisodeNumber(id);

  const handlePreviousEpisode = () => {
    if (episodeNumber > 1) {
      router.push(`/episode/${animeName}-episode-${episodeNumber - 1}`);
    }
  };

  const handleNextEpisode = () => {
    router.push(`/episode/${animeName}-episode-${episodeNumber + 1}`);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mt-6">Episode {id}</h1>
      <div className="mt-4">
        {source1080p ? (
          <ReactPlayer
            url={source1080p.source}
            controls
            width="100%"
            height="100%"
          />
        ) : (
          <p>No 1080p source available</p>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePreviousEpisode}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={episodeNumber <= 1}
        >
          Previous Episode
        </button>
        <button
          onClick={handleNextEpisode}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next Episode
        </button>
      </div>
    </div>
  );
};

export default EpisodePage;
