import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
import { getCache, setCache } from '../../../utils/redis'; 
dotenv.config();

const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
  const { animeName } = req.query;
  const encodedAnimeName = encodeURIComponent(animeName);
  const page = req.query.page || 1;
  const cacheKey = `search-${encodedAnimeName}-page-${page}`;

  try {
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json({ animeMatches: cachedData });
    }

    const searchResponse = await axios.get(`${baseUrl}/search.html?keyword=${encodedAnimeName}&page=${page}`);
    const $ = load(searchResponse.data);
    let animeMatches = [];

    $('.items .img').each((_, element) => {
      const animeElement = $(element);
      const name = animeElement.find('a').attr('title').trim();
      const is_dub = name.includes('(Dub)') ? 'Dub' : 'Sub';
      const image = animeElement.find('img').attr('src');
      const url = animeElement.find('a').attr('href');
      let encodedName = name.replace(/\s+/g, '-').toLowerCase();
      encodedName = encodedName.replace(/[^a-zA-Z0-9-]/g, '');
      encodedName = encodedName.replace(/-+/g, '-'); 

      let animeMatch = { name, encodedName, lang: is_dub, image, url: `${baseUrl}${url}` };
      animeMatches.push(animeMatch);
    });

    if (animeMatches.length === 0) {
      res.status(404).json({ error: 'No results found' });
    } else {
      await setCache(cacheKey, animeMatches);
      res.json({ animeMatches });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve anime' });
  }
}
