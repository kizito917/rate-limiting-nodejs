const { RateLimiterMemory } = require('rate-limiter-flexible');

const MAX_REQUEST_LIMIT = 10;
const MAX_REQUEST_WINDOW = 15 * 60;
const TOO_MANY_REQUESTS_MESSAGE = 'Too many requests';

const options = {
    duration: MAX_REQUEST_WINDOW,
    points: MAX_REQUEST_LIMIT,
};

const rateLimiter = new RateLimiterMemory(options);

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter
        .consume(req.ip)
        .then((rateLimiterRes) => {
            res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
            res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT);
            res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
            res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
            next();
        })
        .catch(() => {
            res.status(429).json({ message: TOO_MANY_REQUESTS_MESSAGE });
        });
};

module.exports = {
    rateLimiterMiddleware,
}