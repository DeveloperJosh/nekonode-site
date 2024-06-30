import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimeList from '../components/AnimeList';

const LatestPage = () => {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      const response = await axios.get('https://api.nekonode.net/api/latest');
      const cleanedData = response.data.map(anime => {
        return { ...anime, url: anime.encodedName };
      });
      setLatest(cleanedData);
    };

    fetchLatest();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mt-6">Latest Episodes</h1>
      <AnimeList animes={latest} />
    </div>
  );
};

export default LatestPage;