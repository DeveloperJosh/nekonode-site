import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import CustomDropdown from '@/components/CustomDropdown';
import ReactPlayer from 'react-player';

const EpisodePlayer = ({ episode, selectedQuality, setSelectedQuality, setSelectedServer, selectedServer }) => {
  const [sources, setSources] = useState({});
  const [loading, setLoading] = useState(true);
  const [playerUrl, setPlayerUrl] = useState('');
  const iframeRef = useRef(null);
  const cache = useRef({});

  useEffect(() => {
    if (episode && episode.animeId && episode.episodeNumber) {
      const fetchSources = async () => {
        setLoading(true); // Start loading when fetching sources
        const cacheKey = `${episode.animeId}-${episode.episodeNumber}`;
        if (cache.current[cacheKey]) {
          setSources(cache.current[cacheKey]);
          setLoading(false);
        } else {
          try {
            const response = await axios.get(`http://localhost:4000/sources?anime_id=${episode.animeId}&episode=${episode.episodeNumber}`);
            setSources(response.data);
            cache.current[cacheKey] = response.data; // Cache the response
            setLoading(false); // Stop loading when sources are fetched
          } catch (error) {
            console.error('Error fetching sources:', error);
            setSources({});
            setLoading(false); // Stop loading even if there is an error
          }
        }
      };

      fetchSources();
    }
  }, [episode]);

  const serverSources = useMemo(() => (Array.isArray(sources[selectedServer]) ? sources[selectedServer] : []), [sources, selectedServer]);

  useEffect(() => {
    if (!episode || !episode.animeId || !episode.episodeNumber || serverSources.length === 0) {
      setPlayerUrl('');
      return;
    }

    let source = serverSources.find(source => source.quality === selectedQuality);
    if (!source) {
      if (selectedServer === 'gogocdn') {
        source = serverSources.find(source => source.quality === 'backup') || serverSources[0];
      } else if (selectedServer === 'streamwish') {
        source = serverSources.find(source => source.quality === 'default') || serverSources[0];
      }
    }

    if (!source) {
      console.error('No suitable source found for the selected server and quality.');
      setPlayerUrl('');
    } else {
      const animeId = episode.animeId;
      const episodeNumber = episode.episodeNumber;
      const quality = source.quality;
      setPlayerUrl(`http://localhost:4000/?anime_id=${animeId}&episode=${episodeNumber}&quality=${quality}&server=${selectedServer}`);
    }
  }, [serverSources, selectedQuality, selectedServer, episode]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">Episode {episode ? episode.episodeNumber : '0'}</h2>
      <div className="relative max-w-full" style={{ paddingBottom: '56.25%' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        )}
        {!loading && playerUrl && (
          <div className="absolute top-0 left-0 w-full h-full">
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              allowFullScreen
              className="rounded-md shadow-lg"
              src={playerUrl}
              loading="lazy"
              onLoad={handleIframeLoad} // Handle iframe load event
            ></iframe>
          </div>
        )}
        {!loading && !playerUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-red-500">No suitable source found for the selected server and quality.</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <p className="font-bold">Select Server:</p>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <p className="font-bold text-sm">If one server isn&apos;t working, Try the next</p>
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
          options={Array.isArray(serverSources) ? serverSources.map(source => source.quality) : []}
          selectedOption={selectedQuality}
          onSelect={setSelectedQuality}
        />
      </div>
    </div>
  );
};

export default EpisodePlayer;
