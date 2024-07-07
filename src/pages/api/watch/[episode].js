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
    const cacheKey = `${server}-${episode}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Check if the episode is 0, and if so, fetch sources by anime name
    let episodeSources = [];
    if (episode === '0') {
      const animeName = req.query.name;
      if (!animeName) {
        return res.status(400).json({ error: 'Anime name is required when episode is 0' });
      }

      const animeCacheKey = `${server}-${animeName}`;
      const cachedAnimeData = await getCache(animeCacheKey);

      if (cachedAnimeData) {
        return res.json(cachedAnimeData);
      }

      const animeSourceData = await selectedServer.getEpisodeSources(animeName);
      animeSourceData.forEach(sourceData => {
        let animeSource = { source: sourceData.url, quality: sourceData.quality };
        episodeSources.push(animeSource);
      });

      if (episodeSources.length === 0) {
        return res.status(404).json({ error: 'No sources found' });
      }

      await setCache(animeCacheKey, episodeSources);

      return res.json(episodeSources);
    }

    // If not cached, fetch the episode sources for a specific episode number
    const episodeSourceData = await selectedServer.getEpisodeSources(episode);
    episodeSourceData.forEach(sourceData => {
      let episodeSource = { source: sourceData.url, quality: sourceData.quality };
      episodeSources.push(episodeSource);
    });

    // If sources are not found, don't cache the response
    if (episodeSources.length === 0) {
      return res.status(404).json({ error: 'No sources found' });
    }

    await setCache(cacheKey, episodeSources);

    return res.json(episodeSources);
  } catch (error) {
    console.error(`Error fetching episode ${episode} from ${server}:`, error);
    return res.status(500).json({ error: `Failed to fetch sources for episode ${episode}.` });
  }
}
