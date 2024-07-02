import { load } from 'cheerio';
import axios from 'axios';
import dotenv from 'dotenv';
import { getCache, setCache } from '../utils/redis';
dotenv.config();

const baseUrl = process.env.BASE_URL;

class StreamWish {
  constructor() {
    this.client = axios.create();
    this.serverName = 'streamwish';
    this.sources = [];
  }

  async extract(videoUrl) {
    try {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      };
      const { data } = await this.client.get(videoUrl, options);

      const linksMatch = data.match(/file:\s*"([^"]+)"/g);
      if (!linksMatch) {
        throw new Error('No video links found');
      }

      // Extract and clean up links
      const links = linksMatch.map(link => link.replace(/file:\s*"|"$/g, ''));

      // Process links
      let lastLink = null;
      for (const link of links) {
        // Skip links with .jpg or .png extensions
        if (link.includes('.jpg') || link.includes('.png')) {
          continue;
        }

        this.sources.push({
          quality: lastLink ? 'backup' : 'default',
          url: link,
          isM3U8: link.includes('.m3u8'),
        });
        lastLink = link;
      }

      // Fetch M3U8 content if available
      if (this.sources.some(source => source.isM3U8)) {
        const m3u8Link = this.sources.find(source => source.isM3U8).url;

        const m3u8Content = await this.client.get(m3u8Link, {
          headers: {
            Referer: videoUrl,
          },
        });

        if (m3u8Content.data.includes('EXTM3U')) {
          const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
          for (const video of videoList) {
            if (video.includes('m3u8')) {
              const url = m3u8Link.split('master.m3u8')[0] + video.split('\n')[1];
              const resolution = video.match(/RESOLUTION=\d+x(\d+)/);
              const quality = resolution ? resolution[1] : 'unknown';

              this.sources.push({
                url: url,
                quality: `${quality}`,
                isM3U8: url.includes('.m3u8'),
              });
            }
          }
        }
      }

      return this.sources;
    } catch (err) {
      console.error('Error extracting video:', err.message);
      throw err;
    }
  }

  async getEpisodeSources(episodeID) {
    try {
      const cacheKey = `episodeSources_${episodeID}`;
      const cachedSources = await getCache(cacheKey);
      if (cachedSources) {
        return cachedSources;
      }

      const response = await axios.get(`${baseUrl}/${episodeID}`);
      const $ = load(response.data);
      let sources = [];

      $('ul li a[rel="13"]').each((_, element) => {
        const videoUrl = $(element).attr('data-video');
        if (videoUrl) {
          sources.push({ url: videoUrl });
          sources = this.extract(videoUrl);
        }
      });

      // Cache the sources
      await setCache(cacheKey, sources);

      return sources;
    } catch (error) {
      console.error('Error getting episode sources:', error.message);
      throw error;
    }
  }
}

export default StreamWish;
