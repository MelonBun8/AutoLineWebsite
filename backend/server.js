require('dotenv').config() // allows us to use dotenv throughout our package in any file we need
const express = require('express')
// Express is a routing and middleware web framework that has minimal functionality 
// of its own: An Express application is essentially a series of middleware function calls.
const app = express() // app is instance of express server
const path = require('path') // for file path manipulation.
const {logger, logEvents} = require('./middleware/logger') // importing our custom middleware (we use curly braces in this case because logger.js has multiple exports, and we wanna import logger only)
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500  // grabs port number from env variable if found, else 3500

connectDB() // connecting to our database (defined in config/dbConn.js)

app.use(logger) // this comes before everything else as the request, once made, first and foremost gets logged, regardless of which path it's for (so it executes for every possible request)
// NOTE: You may notice 3rd party middleware has () in app. use but your 3rd party middleware doesn't. This is becuase YOUR middleware function directly accepts and handles the request using req, res, next, etc. While the 3rd party middleware is a middelware FACTORY, and returns a middleware function.

// allows people from other origins to access our API 
app.use(cors(corsOptions))

app.use(express.json()) // lets our app recieve and parse JSON data

app.use(cookieParser()) // we can now parse cookies in ANY subsequent file called by server.js  (3RD PARTY MIDDLEWARE!!!)
// This cookie parsing adds res.cookie() as a function and req.cookies as an object to set and parse cookie headers respectively


// routing done below: 

// serve static files from the public folder
// __dirname is directory of current file
// app.use is for applying middleware and for loading routers
// below, for the root route, we make the /public folder static and pubically available, serving files within, eg:style.css to use in index.html
// BELOW LINE IS MIDDLEWARE as it adds EXTRA processing to request before it is processed by controller
app.use('/', express.static(path.join(__dirname, 'public'))) // listen for root route, look for static files in public folder
// NOTE: you can choose to add (or not) / before public. so /public also works

// setup route handler / routing for the root path (/) delegating to root.js in the routes folder
app.use('/', require('./routes/root'))

// routing for authorization
app.use('/auth', require('./routes/authRoutes'))

// routing for user CRUD 
app.use('/users', require('./routes/userRoutes'))

// routing for deal reports CRUD
app.use('/deal-reports', require('./routes/dealReportRoutes'))

// now as you can see, we have multiple middleware for the root route that executes IN ORDER. first the static file serving, THEN the 
// root.js being delegated to. In the middleware, if any send() response is called, none of the other following middleware execute and if
// next() is called, then the next middleware for that route is moved to.
// we now create middleware to handle requests for nonexistant routes (basically everything other than what we've specified middleware for)
// actually below and above are not middleware! They are calls to controllers/ last stop where the request is processed
app.all('*', (req,res) => { // req is the request object and has all the request data, while res is the response object
    res.status(404)     
    if (req.accepts('html')) { // for incorrectly routed html requests
        res.sendFile(path.join(__dirname, 'views','404.html'))
    }
    else if (req.accepts('json')) { // for incorrectly routed json requests
        res.json({message:"404 Not Found"})
    }
    else{
        res.type('text').send('404 Not found')
    }
})

// using custome middleware error handler to handle any sort of error that may occur in routing or when using middleware
app.use(errorHandler)

// starts server and listens on PORT. (wrapped in a mongoose connection to ensure the database is properly connected to as well)
mongoose.connection.once('open', () => { // listener function (the .once())
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}   \t${err.syscall}    \t${err.hostname}`, 'mongoErrLog.log')
}) // another listener function (Waiting for an event, then running code once event happens)