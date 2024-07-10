import { getCache, setCache } from "@/utils/redis";

export default async function handler(req, res) {
    const ip = req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const key = `ratelimit:${ip}`;
    const limit = 5;
    const duration = 60; // in seconds

    const current = await getCache(key);
    const currentCount = current ? current.count : 0;
    const resetTime = current ? current.resetTime : (Math.floor(Date.now() / 1000) + duration);
    
    if (currentCount >= limit) {
        res.setHeader("X-RateLimit-Limit", limit);
        res.setHeader("X-RateLimit-Remaining", 0);
        res.setHeader("X-RateLimit-Reset", resetTime);
        return res.status(429).json({ error: "Too many requests" });
    }

    const newCount = currentCount + 1;
    await setCache(key, { count: newCount, resetTime: resetTime }, duration);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", limit - newCount);
    res.setHeader("X-RateLimit-Reset", resetTime);
    
    return res.status(200).end();
}
