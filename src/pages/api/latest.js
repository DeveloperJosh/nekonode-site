import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL;
const ajaxUrl = "https://ajax.gogocdn.net/ajax"; // Ensure you set this in your .env file

export default async function handler(req, res) {
  try {
    const page = req.query.page || 1;
    const type = req.query.type || 1;
    const includeNextPage = req.query.next === 'true';

    const fetchEpisodes = async (url) => {
      const response = await axios.get(url);
      const $ = load(response.data);
      const episodes = [];

      $('div.last_episodes.loaddub > ul > li').each((i, el) => {
        const id = $(el).find('a').attr('href')?.split('/')[1]?.split('-episode')[0];
        const episodeId = $(el).find('a').attr('href')?.split('/')[1];
        const episodeNumber = parseFloat($(el).find('p.episode').text().replace('Episode ', ''));
        let title = $(el).find('p.name > a').attr('title');
        const image = $(el).find('div > a > img').attr('src');
        const url = `${baseUrl}${$(el).find('a').attr('href')?.trim()}`;

        if (!title) {
          title = id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        }

        episodes.push({
          id,
          episodeId,
          episodeNumber,
          title,
          image,
          url,
        });
      });

      const nextPage = $('div.anime_name_pagination.intro > div > ul > li').last().next().find('a').attr('href');
      return { episodes, nextPage };
    };

    const { episodes: latestEpisodes, nextPage } = await fetchEpisodes(`${ajaxUrl}/page-recent-release.html?page=${page}&type=${type}`);

    let allEpisodes = [...latestEpisodes];
    if (includeNextPage && nextPage && nextPage !== `?page=${page}`) {
      const nextPageNumber = nextPage.match(/\?page=(\d+)/)[1];
      if (nextPageNumber > page) {
        const { episodes: nextPageEpisodes } = await fetchEpisodes(`${ajaxUrl}${nextPage}`);
        allEpisodes = [...allEpisodes, ...nextPageEpisodes];
      }
    }

    res.status(200).json(allEpisodes);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Failed to retrieve latest episodes' });
  }
}
