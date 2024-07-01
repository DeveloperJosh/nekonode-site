import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
  let { animeName } = req.query;
  let encodedAnimeName = encodeURIComponent(animeName);

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
      const episodeNumberMatch = episodeTitle.match(/Episode (\d+)/);
      const episodeNumber = episodeNumberMatch ? parseInt(episodeNumberMatch[1], 10) : i + 1;

      if (episodeUrl && episodeTitle) {
        episodes.push({
          episodeNumber: episodeNumber,
          title: episodeTitle,
          url: `https://gogoanime3.co${episodeUrl.trim()}`,
        });
      }
    });

    //episodes.reverse();

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

    res.json({ animeInfo, episodes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve anime' });
  }
}
