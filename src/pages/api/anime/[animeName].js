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

  // Check if the response is already cached
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(`${baseUrl}/category/${encodedAnimeName}`);
    const $ = load(response.data);

    const movieId = $('input#movie_id').val();
    if (!movieId) {
      return res.status(404).json({ error: 'Movie ID not found' });
    }

    const apiUrl = "https://ajax.gogocdn.net/ajax/load-list-episode";
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
      const episodeUrl = $api(element).find('a').attr('href');
      const episodeTitle = $api(element).find('.name').text().trim();
      const episodeNumberMatch = episodeTitle.match(/EP (\d+)/i);
      const episodeNumber = episodeNumberMatch ? parseInt(episodeNumberMatch[1], 10) : null;

      let id = episodeUrl.trim();
      id = id.replace(/\//g, '');

      if (episodeUrl && episodeTitle) {
        episodes.push({
          episodeNumber,
          title: episodeTitle,
          id: id,
          url: `https://gogoanime3.co${episodeUrl.trim()}`
        });
      }
    });

    episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);

    const isEp0Found = episodes.some(ep => ep.title.toLowerCase().includes('ep 0'));

    if (isEp0Found) {
      episodes.forEach((episode, index) => {
        episode.episodeNumber = index;
      });
    } else {
      episodes.forEach((episode, index) => {
        episode.episodeNumber = index + 1;
      });
    }

    let anime = req.query.animeName;
    anime = anime.replace(/\s+/g, '-').toLowerCase();
    anime = anime.replace(/:/g, '');
    const encodedAnime = encodeURIComponent(anime);

    const animeResponse = await axios.get(`${baseUrl}/category/${encodedAnime}`);
    const animePage = load(animeResponse.data);
    let animeInfo = {};

    const title = animePage('.anime_info_body_bg h1').text().trim() || 'Unknown Title';
    const image = animePage('.anime_info_body_bg img').attr('src') || 'No Image Available';
    const description = animePage('.description').text().trim() || 'No description available.';
    const status = animePage('span:contains("Status:")').parent().find('a').text().trim() || 'Unknown Status';

    const genres = [];
    animePage('span:contains("Genre:")').parent().find('a').each((_, element) => {
      const genre = $(element).text().replace(/^,/, '').trim();
      genres.push(genre);
    });

    const cleanGenres = genres.filter(genre => genre);

    const released = animePage('span:contains("Released:")').parent().text().replace('Released:', '').trim() || 'Unknown Release Date';

    const epEndAttribute = animePage('#episode_page a').last().attr('ep_end');
    const totalEpisodes = epEndAttribute ? parseInt(epEndAttribute, 10) : 'Not Available';

    animeInfo = {
      title,
      image,
      description,
      status,
      genres: cleanGenres,
      released,
      totalEpisodes,
    };

    const responseData = { animeInfo, episodes };

    // Cache the response data
    await setCache(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error retrieving anime info:', error);

    // Detailed error logging
    if (error.response) {
      console.log('Error Response Data:', error.response.data);
      console.log('Error Response Status:', error.response.status);
      console.log('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      console.log('Error Request Data:', error.request);
    } else {
      console.log('Error Message:', error.message);
    }

    console.log('Encoded anime name:', encodedAnimeName);
    res.status(500).json({ error: 'Failed to retrieve anime' });
  }
}
