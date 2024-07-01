// Description: This file contains the code to extract video sources from GogoCDN server.
import axios from 'axios';
import { load } from 'cheerio';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { getCache, setCache } from './cache.js';
import VideoExtractor from './VideoExtractor.js'; 

dotenv.config();

const baseUrl = process.env.BASE_URL;

const keys = {
    key: CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY),
    secondKey: CryptoJS.enc.Utf8.parse(process.env.CRYPTO_SECOND_KEY),
    iv: CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV),
};

function validateEnvVars() {
    if (!baseUrl) throw new Error('BASE_URL is not defined in the environment variables');
    if (!keys.key) throw new Error('CRYPTO_KEY is not defined in the environment variables');
    if (!keys.secondKey) throw new Error('CRYPTO_SECOND_KEY is not defined in the environment variables');
    if (!keys.iv) throw new Error('CRYPTO_IV is not defined in the environment variables');
}

validateEnvVars();

class GogoCDN extends VideoExtractor {
    constructor() {
        super();
        this.serverName = 'GogoCDN';
        this.sources = [];
    }

    async getIframeSrc(episode) {
        try {
            episode = episode.replace(':', '');

            const cachedIframeSrc = await getCache(episode);
            if (cachedIframeSrc) {
                return cachedIframeSrc;
            }

            const url = `${baseUrl}/${episode}`;
            const { data: html } = await axios.get(url);

            const $ = load(html);
            const iframeSrc = $('#load_anime > div > div > iframe').attr('src');

            if (iframeSrc) {
                await setCache(episode, iframeSrc);
            }

            return iframeSrc;
        } catch (error) {
            console.error('Error fetching or parsing HTML:', error);
            throw new Error('Failed to retrieve iframe source');
        }
    }

    async generateEncryptedAjaxParams($, id) {
        try {
            const encryptedKey = CryptoJS.AES.encrypt(id, keys.key, { iv: keys.iv }).toString();
            const scriptValue = $("script[data-name='episode']").attr('data-value');
            const decryptedToken = CryptoJS.AES.decrypt(scriptValue, keys.key, { iv: keys.iv }).toString(CryptoJS.enc.Utf8);

            return `id=${encryptedKey}&alias=${id}&${decryptedToken}`;
        } catch (error) {
            console.error('Error generating encrypted AJAX parameters:', error);
            throw new Error('Failed to generate encrypted AJAX parameters');
        }
    }

    async decryptAjaxData(encryptedData) {
        try {
            const decryptedData = CryptoJS.AES.decrypt(encryptedData, keys.secondKey, { iv: keys.iv }).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error('Error decrypting AJAX data:', error);
            throw new Error('Failed to decrypt AJAX data');
        }
    }

    async extractVideoUrls(videoUrl) {
        try {
            const cachedSources = await getCache(videoUrl.href);
            if (cachedSources) {
                return cachedSources;
            }

            const res = await axios.get(videoUrl.href);
            const $ = load(res.data);

            const encryptedParams = await this.generateEncryptedAjaxParams($, videoUrl.searchParams.get('id') || '');
            const { data: encryptedData } = await axios.get(`${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?${encryptedParams}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const decryptedData = await this.decryptAjaxData(encryptedData.data);
            if (!decryptedData.source) throw new Error('No source found. Try a different server.');

            const sources = [];
            if (decryptedData.source[0].file.includes('.m3u8')) {
                const resResult = await axios.get(decryptedData.source[0].file.toString());
                const resolutions = resResult.data.match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g);
                resolutions.forEach(res => {
                    const index = decryptedData.source[0].file.lastIndexOf('/');
                    const quality = res.split('\n')[0].split('x')[1].split(',')[0];
                    const url = decryptedData.source[0].file.slice(0, index);
                    sources.push({
                        url: url + '/' + res.split('\n')[1],
                        isM3U8: (url + res.split('\n')[1]).includes('.m3u8'),
                        quality: quality + 'p'
                    });
                });
            } else {
                decryptedData.source.forEach(source => {
                    sources.push({
                        url: source.file,
                        isM3U8: source.file.includes('.m3u8'),
                        quality: source.label.split(' ')[0] + 'p'
                    });
                });
            }

            decryptedData.source_bk.forEach(source => {
                sources.push({
                    url: source.file,
                    isM3U8: source.file.includes('.m3u8'),
                    quality: 'backup'
                });
            });

            await setCache(videoUrl.href, sources);
            return sources;
        } catch (error) {
            console.error('Error extracting video URLs:', error);
            throw new Error('Failed to extract video URLs');
        }
    }

    async getEpisodeSources(name) {
        try {
            const iframeSrc = await this.getIframeSrc(name);
            const videoUrl = new URL(iframeSrc);
            const videoSources = await this.extractVideoUrls(videoUrl);
            return videoSources;
        } catch (error) {
            console.error('Error getting episode sources:', error);
            throw new Error('Failed to get episode sources');
        }
    }
}

export default GogoCDN;