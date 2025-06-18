const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async(req, res) => {
    const { username, password } = req.body // destructuring

    if (!username || !password) {
        return(res.status(400).json( {message:'All fields are required'} ))
    }

    const foundUser = await User.findOne({ username }).exec()

    if ( !foundUser ) { // not including the .active check for now
        return(res.status(401).json( {message:'Unauthorized'} ))
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json( {message: 'Unauthorized'} )
    console.log('Successfully logged in!!!')
    // console.log(username)
    // console.log(password)
    const accessToken = jwt.sign( 
        {
            "UserInfo": {
                "username" : foundUser.username,
                "roles" : foundUser.roles,
            } // This information is being inserted into the access token, and we need to destructure this access token at the frontend side where we receive it 
        },

        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // 15 minutes standard
    )

    const refreshToken = jwt.sign(
        {"username" : foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } 
    )

    // create a secure cookie with the refresh token to send to the client (client-side will not be able to access it)
    res.cookie('jwt', refreshToken, { 
        httpOnly: true, // accessible only by web server 
        secure: true, // use https
        sameSite: 'None', // cross-site availability cookie allowed (cuz we can host our REST API and Client App at separate servers)
        maxAge: 7 * 24 * 60 * 60 * 1000 // time for a week in milliseconds (cookie expiry, matches refresh token's)
    })

    // Send the access token containing username and roles
    console.log('Access token created')
    console.log(accessToken)
    res.json({ accessToken }) // client recieves accessToken. Server sets the cookie so the client never actually handles the refresh token 
    // within the cookie But we ensure when client sends a request to refresh endpoint this cookie is sent along with it
})

// @desc Refresh    
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => { // client calls refresh endpoint with accessToken cookie, it's routed and handled here (issues new access token if refresh token is valid)
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({ message : 'Unauthorized' })
    
    const refreshToken = cookies.jwt

    jwt.verify( // use JWT library to verify the refresh token and issue access token if valid
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET, // up until this part is the actual verification

        asyncHandler(async (err, decoded) => { // catches unexpected async errors, though err has error from the verify process
            if (err) return res.status(403).json({ message: 'Forbidden' }) 

            const foundUser = await User.findOne({ username: decoded.username }).exec() // if there is a user inside the refresh token

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign( // if username valid and found, we create a new access token with that username
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}


// @desc Logout
// @route POST /auth/logout
// @access Public - to clear cookies if they exist
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {console.log('No cookies sent!')}
    if (!cookies?.jwt) {return res.sendStatus(204)} // no content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
    console.log('Successfully logged out properly with 200 code!')
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout 
} 

// this file sets up the authController logic with the endpoints, but we still need to have it protect other endpoints with the tokens above.
// For this we have the middleware 'verifyJWT.js'