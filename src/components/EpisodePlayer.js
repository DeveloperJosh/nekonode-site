// EpisodePlayer.jsx
import React, { useState, useEffect } from 'react';
import ReactIframe from 'react-iframe';

const player_url = 'https://nekoplayer.xyz/';

const EpisodePlayer = ({ episode, setSelectedServer, selectedServer }) => {
  const [loading, setLoading] = useState(true);
  const [playerUrl, setPlayerUrl] = useState('');
  const [episodeLoaded, setEpisodeLoaded] = useState(false);

  useEffect(() => {
    if (!episode || !episode.episodeId) {
      setPlayerUrl('');
      setLoading(false);
      return;
    }

    console.log('Loading new episode...');
    setLoading(true);
    setEpisodeLoaded(false);

    const timer = setTimeout(() => {
      setEpisodeLoaded(true);
    }, 1000); // Simulate 1-second episode loading time

    return () => clearTimeout(timer);
  }, [selectedServer, episode]);

  useEffect(() => {
    if (episodeLoaded) {
      const url = `${player_url}?anime_id=${episode.episodeId}&server=${selectedServer}`;
      setPlayerUrl(url);
      setLoading(false);
    }
  }, [episodeLoaded, selectedServer, episode]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">Episode {episode ? episode.episodeNumber : '0'}</h2>
      <div className="relative max-w-full" style={{ paddingBottom: '56.25%' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-500 opacity-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        )}
        <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {playerUrl && (
            <ReactIframe
              url={playerUrl}
              width="100%"
              height="100%"
              allow='fullscreen'
              className="rounded-md shadow-lg"
              loading="lazy"
              onLoad={handleIframeLoad}
            />
          )}
        </div>
        {!loading && !playerUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-red-500">No suitable source found for the selected server and quality.</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <p className="font-bold">Select Server:</p>
        <button
          onClick={() => setSelectedServer('gogocdn')}
          className={`px-4 py-2 mx-2 rounded ${selectedServer === 'gogocdn' ? 'bg-yellow-500 text-gray-800' : 'bg-gray-700 text-gray-300'}`}
        >
          Neko
        </button>
        <button
          onClick={() => setSelectedServer('streamwish')}
          className={`px-4 py-2 mx-2 rounded ${selectedServer === 'streamwish' ? 'bg-yellow-500 text-gray-800' : 'bg-gray-700 text-gray-300'}`}
        >
          StreamWish
        </button>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <p className="font-bold text-sm">If one server isn&apos;t working, try the next</p>
      </div>
    </div>
  );
};

export default EpisodePlayer;
