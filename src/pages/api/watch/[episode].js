import GogoCDN from '../../../extractor/gogocdn';
import StreamWish from '../../../extractor/streamwish';
import { getCache, setCache } from '@/utils/redis';

const servers = {
  gogocdn: new GogoCDN(),
  streamwish: new StreamWish(),
  // Add other servers here
};

export default async function handler(req, res) {
  const { episode, server = 'gogocdn' } = req.query; // Default to 'gogocdn' if no server is specified

  const selectedServer = servers[server.toLowerCase()];

  if (!selectedServer) {
    return res.status(400).json({ error: 'Invalid server specified' });
  }

  try {
    // Check if the episode sources are cached
    const cacheKey = `${server}-${episode}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // If not cached, fetch the episode sources
    const episodeSourceData = await selectedServer.getEpisodeSources(episode);
    let episodeSources = [];

    episodeSourceData.forEach(sourceData => {
      let episodeSource = { source: sourceData.url, quality: sourceData.quality };
      episodeSources.push(episodeSource);
    });

    await setCache(cacheKey, episodeSources);

    return res.json(episodeSources);
  } catch (error) {
    console.error(`Error fetching episode ${episode} from ${server}:`, error);
    
    try {
      // Attempt to fetch sources by anime name as a fallback
      const animeName = episode.split('-episode-')[0];
      if (!animeName) {
        throw new Error('Invalid episode name');
      }
      const cacheKey = `${server}-${animeName}`;
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const animeSourceData = await selectedServer.getEpisodeSources(animeName);
      let animeSources = [];

      animeSourceData.forEach(sourceData => {
        let animeSource = { source: sourceData.url, quality: sourceData.quality };
        animeSources.push(animeSource);
      });

      await setCache(cacheKey, animeSources);

      return res.json(animeSources);
    } catch (fallbackError) {
      const animeName = episode.split('-episode-')[0];
      console.error(`Error fetching anime ${animeName} from ${server}:`, fallbackError);
      return res.status(500).json({ error: `Failed to fetch sources for both episode ${episode} and anime ${animeName}.` });
    }
  }
}
