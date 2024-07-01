import GogoCDN from '../../../extractor/gogocdn';
const gogoCDN = new GogoCDN();

export default async function handler(req, res) {
  const { episode } = req.query;

  try {
    const episodeSourceData = await gogoCDN.getEpisodeSources(episode);
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
