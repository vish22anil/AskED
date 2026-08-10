import rateLimit from 'express-rate-limit';

// If Redis is configured, we could plug in a Redis store here.
// For graceful fallback, we use the default memory store when Redis is unavailable.
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 AI requests per minute
  message: { success: false, message: 'Too many AI requests from this IP, please try again after a minute' },
  standardHeaders: true,
  legacyHeaders: false,
});
