import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per window (here, 1 min)
    message: 'Too many requests, please try again later after 60 seconds.',
})
export {limiter}