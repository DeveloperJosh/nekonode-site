import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.BASE_URL;
const ajaxUrl = process.env.AJAX_URL;

export default async function handler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const type = parseInt(req.query.type) || 1;
    const includeNextPage = req.query.next === 'true';

    const fetchEpisodes = async (pageNumber) => {
      try {
        const url = `${ajaxUrl}/page-recent-release.html?page=${pageNumber}&type=${type}`;
        const response = await axios.get(url);
        const $ = load(response.data);
        const episodes = [];

        $('div.last_episodes.loaddub > ul > li').each((i, el) => {
          let id = $(el)
            .find('a')
            .attr('href')
            ?.split('/')[1]
            ?.split('-episode')[0];

          if (id && id.endsWith('season-ii')) {
            id = id.replace('season-ii', 'season-2');
          }

          const episodeId = $(el).find('a').attr('href')?.split('/')[1];
          const episodeNumber = parseFloat(
            $(el).find('p.episode').text().replace('Episode ', '')
          );
          let title = $(el).find('p.name > a').attr('title');
          const image = $(el).find('div > a > img').attr('src');
          const url = `${baseUrl}${$(el).find('a').attr('href')?.trim()}`;

          if (!title && id) {
            title = id
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());
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

        return episodes;
      } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error.message);
        return [];
      }
    };

    const fetchPromises = [fetchEpisodes(page)];

    if (includeNextPage) {
      fetchPromises.push(fetchEpisodes(page + 1));
    }

    const results = await Promise.all(fetchPromises);
    const allEpisodes = results.flat();

    res.status(200).json(allEpisodes);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Failed to retrieve latest episodes' });
  }
}
