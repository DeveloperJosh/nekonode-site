import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import CustomDropdown from '@/components/CustomDropdown';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const EpisodePlayer = ({ episode, selectedQuality, setSelectedQuality, setSelectedServer, selectedServer }) => {
  const sources = episode?.sources ?? [];
  const sourceUrl = useMemo(() => {
    const source = sources.find(source => source.quality === selectedQuality);
    return source ? source.source : sources[0]?.source;
  }, [sources, selectedQuality]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">Episode {episode ? episode.episodeNumber : '1'}</h2>
      <div className="player-wrapper">
        {episode && episode.sources ? (
          <ReactPlayer
            url={sourceUrl}
            controls
            width="100%"
            height="100%"
            className="react-player"
          />
        ) : (
          <div className="text-center text-gray-300">Loading...</div>
        )}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        { /* Bold message */}
        <p className="font-bold">Select Server:</p>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
         <p className="font-bold text-sm">If one server isn't working, Try the next</p>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
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
        <CustomDropdown
          label="Quality"
          options={sources.map(source => source.quality)}
          selectedOption={selectedQuality}
          onSelect={setSelectedQuality}
        />
      </div>
    </div>
  );
};

export default EpisodePlayer;
