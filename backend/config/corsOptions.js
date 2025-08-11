const allowedOrigins = require("./allowedOrigins"); // in a separate file if we wanna refer to them somewhere else in our API

const corsOptions = { // 3rd party middleware so we follow their formatting
    origin : (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){ // if it is one of the allowed origins OR postman and some other desktop app
            callback(null, true) // error object is kept as null
        }
        else {
            callback(null, true)
            //callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions
