import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
import { getCache, setCache } from '../../../utils/redis';

dotenv.config();

const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
  let { animeName } = req.query;
  
  let encodedAnimeName = encodeURIComponent(animeName);
  const cacheKey = `animeInfo_${encodedAnimeName}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // Fetch the anime page once
    const response = await axios.get(`${baseUrl}/category/${encodedAnimeName}`);
    const $ = load(response.data);

    // Extract movie ID
    const movieId = $('input#movie_id').val();
    if (!movieId) {
      return res.status(404).json({ error: 'Movie ID not found' });
    }

    // Extract anime information
    const animeInfo = {
      title: $('.anime_info_body_bg h1').text().trim() || 'Unknown Title',
      image: $('.anime_info_body_bg img').attr('src') || 'No Image Available',
      description: $('.description').text().trim() || 'No description available.',
      status: $('span:contains("Status:")').next().text().trim() || 'Unknown Status',
      genres: $('p:contains("Genre:")')
        .find('a')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean),
      released: $('span:contains("Released:")')
        .parent()
        .text()
        .replace('Released:', '')
        .trim() || 'Unknown Release Date',
      totalEpisodes:
        parseInt($('#episode_page a').last().attr('ep_end'), 10) || 'Not Available',
    };    

    // Fetch episode list
    const apiUrl = 'https://ajax.gogocdn.net/ajax/load-list-episode';
    const params = {
      ep_start: 0,
      ep_end: 9999,
      id: movieId,
    };
    const apiResponse = await axios.get(apiUrl, { params });

    if (!apiResponse.data) {
      return res.status(404).json({ error: 'No episodes found' });
    }

    const $api = load(apiResponse.data);
    const episodes = [];

    $api('li').each((i, element) => {
      const episodeNumberMatch = $api(element).find('.name').text().trim().match(/EP (\d+)/i);
      const episodeNumber = episodeNumberMatch ? parseInt(episodeNumberMatch[1], 10) : null;

      if (episodeNumber !== null) {
        episodes.push(episodeNumber);
      }
    });

    episodes.sort((a, b) => a - b);

    // Prepare the response data
    const responseData = { animeInfo, episodes };

    // Cache the response data
    await setCache(cacheKey, responseData);

    // Send the response
    res.json(responseData);
  } catch (error) {
    console.error('Error retrieving anime info:', error);
    res.status(500).json({ error: 'Failed to retrieve anime' });
  }
}
