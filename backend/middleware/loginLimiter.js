// rate limiter for the logout and login routes
const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger') // calling in logEvents middleware

const  loginLimiter = rateLimit({ // below we set the options for rate limiting in an options object
    windowMs: 60 * 1000, // in milliseconds, so 60 secs
    max: 5, // limit each IP to 5 login requests per 'window' per minute
    message: {message: 'Too many login attempts from this IP, please try again after a minute (60 seconds)'},
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    // below are options recommended in the rateLimiter middleware documentation
    standardHeaders: true, // return rate limit info in the 'RateLimit-*' headers 
    legacyHeaders: false, // disable the 'X-RateLimit-*' headers
})

module.exports = loginLimiter