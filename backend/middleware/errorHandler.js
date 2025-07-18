const {logEvents} = require('./logger')

const errorHandler = (err, req, res, next) => { // this will override default express error handling
    logEvents(`${err.name}: ${err.message}      \t${req.method}     \t${req.url}    \t${req.headers.origin}`, `errLog.log`)
    console.log(err.stack) // gives details about an error on error
    
    const status = res.statusCode ? res.statusCode : 500 // Server error code 500 if response doesn't already have a status code
    // unkown errors with unexpected / unknown responses are the default given 500

    res.status(status) // set status code of response
    
    res.json({ message: err.message, isError:true }) // the extra isError flag is to allow the frontend to identify errors from the backend
    // better frontend DX (Developer experience)
}

module.exports = errorHandler