import NodeCache from 'node-cache';

// Create a new cache instance with a default TTL of 3592 seconds
const cache = new NodeCache({ stdTTL: 3592, checkperiod: 600 });

/**
 * Set a value in the cache.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache.
 * @param {number} [ttl=3592] - Time to live in seconds. Default is 3592 seconds.
 * @returns {Promise<void>}
 */
export async function setCache(key, value, ttl = 3592) {
    try {
        if (typeof key !== 'string') {
            throw new Error(`Invalid key type: ${typeof key}. Expected a string.`);
        }

        cache.set(key, value, ttl);
        console.log(`Cached key: ${key} with TTL: ${ttl}s`);
    } catch (error) {
        console.error('Error setting cache in NodeCache:', error.message);
    }
}

/**
 * Get a value from the cache.
 * @param {string} key - The cache key.
 * @returns {Promise<any|null>} - The cached value or null if not found.
 */
export async function getCache(key) {
    try {
        if (typeof key !== 'string') {
            throw new Error(`Invalid key type: ${typeof key}. Expected a string.`);
        }

        const cachedValue = cache.get(key);
        return cachedValue !== undefined ? cachedValue : null;
    } catch (error) {
        console.error('Error getting cache from NodeCache:', error.message);
        return null;
    }
}

function clearCache() {
    cache.flushAll();
    console.log('Cache cleared successfully');
}

setInterval(clearCache, 3600000); 