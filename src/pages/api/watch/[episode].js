import GogoCDN from '../../../extractor/gogocdn';
import StreamWish from '../../../extractor/streamwish';

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
    const episodeSourceData = await selectedServer.getEpisodeSources(episode);
    let episodeSources = [];

    episodeSourceData.forEach(sourceData => {
      let episodeSource = { source: sourceData.url, quality: sourceData.quality };
      episodeSources.push(episodeSource);
    });

    res.json(episodeSources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve episode sources' });
  }
}
