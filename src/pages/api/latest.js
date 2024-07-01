import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL;

export default async function handler(req, res) {
  try {
    const page = req.query.page || 1;
    const includeNextPage = req.query.next === 'true';

    const fetchEpisodes = async (url) => {
      const response = await axios.get(url);
      const $ = load(response.data);
      let episodes = [];

      $('.items .img').each((_, element) => {
        const animeElement = $(element);
        let name = animeElement.find('a').attr('title').trim();
        const image = animeElement.find('img').attr('src');
        const url = animeElement.find('a').attr('href');
        const lang = name.includes('(Dub)') ? 'Dub' : 'Sub';
        let encodedName = name.replace(/\s+/g, '-').toLowerCase();
        encodedName = encodedName.replace(/[^a-zA-Z0-9-]/g, '');

        let animeMatch = { name, encodedName, lang, image, url: `${baseUrl}${url}` };
        episodes.push(animeMatch);
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

    res.json(allEpisodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve latest episodes' });
  }
}
