import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
import { getCache, setCache } from '../../utils/redis';
dotenv.config();

const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const page = req.query.page || 1;
    const includeNextPage = req.query.next === 'true';
    const cacheKey = `latestAnime-page-${page}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const fetchEpisodes = async (url) => {
      const response = await axios.get(url);
      const $ = load(response.data);
      const episodes = [];

      $('.last_episodes .items li').each((_, element) => {
        const animeElement = $(element);
        const name = animeElement.find('.name a').attr('title').trim();
        const image = animeElement.find('.img img').attr('src');
        const episodeUrl = animeElement.find('.name a').attr('href');
        const lang = name.includes('(Dub)') ? 'Dub' : 'Sub';
        const episodeText = animeElement.find('.episode').text().trim();
        const episodeMatch = episodeText.match(/Episode (\d+)/);
        const episode = episodeMatch ? `Episode ${episodeMatch[1]}` : 'Unknown Episode';
        let encodedName = name.replace(/\s+/g, '-').toLowerCase();
        encodedName = encodedName.replace(/[^a-zA-Z0-9-]/g, '');

        episodes.push({
          name,
          episode,
          encodedName,
          lang,
          image,
          url: `${baseUrl}${episodeUrl}`,
        });
      });

      const nextPage = $('div.anime_name_pagination.intro a[data-page]').last().attr('href');
      return { episodes, nextPage };
    };

    const { episodes: latestEpisodes, nextPage } = await fetchEpisodes(`${baseUrl}?page=${page}`);

    let allEpisodes = [...latestEpisodes];
    if (includeNextPage && nextPage && nextPage !== `?page=${page}`) {
      const nextPageNumber = nextPage.match(/\?page=(\d+)/)[1];
      if (nextPageNumber > page) {
        const { episodes: nextPageEpisodes } = await fetchEpisodes(`${baseUrl}${nextPage}`);
        allEpisodes = [...allEpisodes, ...nextPageEpisodes];
      }
    }

    await setCache(cacheKey, allEpisodes);
    res.status(200).json(allEpisodes);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Failed to retrieve latest episodes' });
  }
}
