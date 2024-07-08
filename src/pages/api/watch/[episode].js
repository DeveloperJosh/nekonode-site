import GogoCDN from '../../../extractor/gogocdn';
import StreamWish from '../../../extractor/streamwish';
import { getCache, setCache } from '@/utils/redis';

const servers = {
  gogocdn: new GogoCDN(),
  streamwish: new StreamWish(),
  // Add other servers here
};

const generateETag = (data) => {
  return `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
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
      const etag = generateETag(cachedData);
      res.setHeader('ETag', etag);

      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }

      return res.json(cachedData);
    }

    let episodeSources = [];
    if (episode === '0') {
      const animeName = req.query.name;
      if (!animeName) {
        return res.status(400).json({ error: 'Anime name is required when episode is 0' });
      }

      const animeCacheKey = `${server}-${animeName}`;
      const cachedAnimeData = await getCache(animeCacheKey);

      if (cachedAnimeData) {
        const etag = generateETag(cachedAnimeData);
        res.setHeader('ETag', etag);

        if (req.headers['if-none-match'] === etag) {
          return res.status(304).end();
        }

        return res.json(cachedAnimeData);
      }

      const animeSourceData = await selectedServer.getEpisodeSources(animeName);
      episodeSources = animeSourceData.map(sourceData => ({
        source: sourceData.url,
        quality: sourceData.quality,
      }));

      if (episodeSources.length === 0) {
        return res.status(404).json({ error: 'No sources found' });
      }

      await setCache(animeCacheKey, episodeSources);

      const etag = generateETag(episodeSources);
      res.setHeader('ETag', etag);
      return res.json(episodeSources);
    }

    const episodeSourceData = await selectedServer.getEpisodeSources(episode);
    episodeSources = episodeSourceData.map(sourceData => ({
      source: sourceData.url,
      quality: sourceData.quality,
    }));

    if (episodeSources.length === 0) {
      return res.status(404).json({ error: 'No sources found' });
    }

    await setCache(cacheKey, episodeSources);

    const etag = generateETag(episodeSources);
    res.setHeader('ETag', etag);
    return res.json(episodeSources);
  } catch (error) {
    console.error(`Error fetching episode ${episode} from ${server}:`, error);
    return res.status(500).json({ error: `Failed to fetch sources for episode ${episode}.` });
  }
}
