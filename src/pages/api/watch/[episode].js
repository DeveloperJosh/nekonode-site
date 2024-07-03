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

    res.json(episodeSources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve episode sources' });
  }
}
