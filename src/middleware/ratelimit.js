// ratelimt for next-js api
import { getCache, setCache } from "@/utils/redis";

export default async function handler(req, res) {
    const ip = req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const key = `ratelimit:${ip}`;
    const limit = 5;
    const duration = 60;
    const current = await getCache(key);
    if (current >= limit) {
        return res.status(429).json({ error: "Too many requests" });
    }
    await setCache(key, current ? current + 1 : 1, duration);
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", limit - (current ? current : 0) - 1);
    res.setHeader("X-RateLimit-Reset", duration);
    return res.status(200).end();
}
//       res.setHeader('ETag', etag);