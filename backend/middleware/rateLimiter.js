const { RateLimiterMemory } = require('rate-limiter-flexible');

// General API rate limiter
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Number of requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900, // Per 15 minutes (900 seconds)
});

// WhatsApp webhook rate limiter (more restrictive)
const whatsappRateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 50, // Number of requests
  duration: 900, // Per 15 minutes
});

// Authentication rate limiter (very restrictive)
const authRateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      retryAfter: secs
    });
  }
};

const whatsappRateLimiterMiddleware = async (req, res, next) => {
  try {
    await whatsappRateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      success: false,
      message: 'Too many WhatsApp requests',
      retryAfter: secs
    });
  }
};

const authRateLimiterMiddleware = async (req, res, next) => {
  try {
    await authRateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts',
      retryAfter: secs
    });
  }
};

module.exports = {
  rateLimiter: rateLimiterMiddleware,
  whatsappRateLimiter: whatsappRateLimiterMiddleware,
  authRateLimiter: authRateLimiterMiddleware
};
