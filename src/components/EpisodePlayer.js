import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CustomDropdown from '@/components/CustomDropdown';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const EpisodePlayer = ({ episode, selectedQuality, setSelectedQuality }) => {
  const [loading, setLoading] = useState(true);

  const sources = episode?.sources ?? [];
  const sourceUrl = useMemo(() => {
    const source = sources.find(source => source.quality === selectedQuality);
    return source ? source.url : sources[0]?.url;
  }, [sources, selectedQuality]);

  const handleReady = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
  }, [sourceUrl]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">Episode {episode ? episode.episodeNumber : '1'}</h2>
      <div className="relative player-wrapper">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        )}
        {episode && episode.sources && (
          <ReactPlayer
            url={sourceUrl}
            controls
            width="100%"
            height="100%"
            className="react-player"
            onReady={handleReady}
          />
        )}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
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
