import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
  const { animeName } = req.query;
  const encodedAnimeName = encodeURIComponent(animeName);
  const page = req.query.page || 1;

  try {

    const searchResult = {
      currentPage: page,
      hasNextPage: false,
      results: [],
    };

    const searchResponse = await axios.get(`${baseUrl}/filter.html?keyword=${encodedAnimeName}&page=${page}`);
    const $ = load(searchResponse.data);

    searchResult.hasNextPage = $('div.anime_name.new_series > div > div > ul > li.selected').next().length > 0;

    $('div.last_episodes > ul > li').each((_, el) => {
      const animeElement = $(el);
      const title = animeElement.find('p.name > a').text();
      const url = `${baseUrl}/${animeElement.find('p.name > a').attr('href')}`;
      const image = animeElement.find('div > a > img').attr('src');
      const releaseDate = animeElement.find('p.released').text().trim();
      const subOrDub = title.toLowerCase().includes('dub') ? 'Dub' : 'Sub';

      const id = animeElement.find('p.name > a').attr('href')?.split('/')[2];

      searchResult.results.push({
        id,
        title,
        url,
        image,
        releaseDate,
        subOrDub,
      });
    });

    if (searchResult.results.length === 0) {
      res.status(404).json({ error: 'No results found' });
    } else {
     // await setCache(cacheKey, searchResult);
      //console.log({ searchResult });
      res.json({ searchResult });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve anime' });
  }
}
