// pages/api/Top10.js

import axios from 'axios';
import { load } from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  const page = req.query.page || 1;

  try {
    const ajaxUrl = 'https://ajax.gogocdn.net/ajax';
    const baseUrl =  process.env.BASE_URL

    const response = await axios.get(`${ajaxUrl}/page-recent-release-ongoing.html?page=${page}`);
    const html = response.data;
    const $ = load(html);

    const topAiring = [];

    $('div.added_series_body.popular > ul > li').each((i, el) => {
      const id = $(el).find('a:nth-child(1)').attr('href')?.split('/')[2] || '';
      let title = $(el).find('a:nth-child(1)').attr('title') || '';
      const image = $(el).find('a:nth-child(1) > div').attr('style')?.match('(https?://.*.(?:png|jpg))')[0] || '';
      const url = `${baseUrl}${$(el).find('a:nth-child(1)').attr('href')}`;
      const genres = $(el)
        .find('p.genres > a')
        .map((i, el) => $(el).attr('title'))
        .get();
      const episodeId = $(el).find('p:nth-of-type(2) > a').attr('title') || '';
      const episodeNumber = parseFloat($(el).find('p:nth-of-type(2) > a').text().replace('Episode ', ''));

      // if title is empty, then make ID the title by making it look like a title
      if (!title) {
        title = id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      }

      topAiring.push({
        id,
        title,
        image,
        url,
        genres,
        episodeId,
        episodeNumber,
      });
    });

    const hasNextPage = !$('div.anime_name.comedy > div > div > ul > li').last().hasClass('selected');

    res.status(200).json({
      currentPage: parseInt(page, 10),
      hasNextPage,
      results: topAiring,
    });
  } catch (error) {
    console.error('Error fetching top airing anime:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
}
