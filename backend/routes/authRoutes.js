const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')


router.route('/') //Login root route (remember, this will be at /auth already, so root of /auth, since we called it from /auth route at the server.js) 
    .post(loginLimiter, authController.login) // login limiter is middleware that runs before authController.login. You can chain multiple middleware to run before the ultimate endpoint function by passing them into .post before the endpoint function
    // above is how you apply middleware to just one route instead of app.user for all subsequent served routes in app

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router