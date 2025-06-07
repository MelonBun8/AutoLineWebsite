const { format } = require('date-fns') // from npm
const { v4: uuid } = require('uuid')
// the above is called destructuring to get dependencies as in JS, you can obtain the VALUE in a KEY of an object by destructuring 
// (getting a value of a key of an object into a variable with the same name as the key!)
// the second import also uses aliasing with destructuring to rename the obtained value to another name than the key of that value (v4 
// gets an alias of uuid)
const fs = require('fs') // file system module of node.js
const fsPromises = require('fs').promises
const path = require('path') // for nodeJS path.join, which creates a single path out of many path segments (each a string)

const logEvents = async(message, logFileName) => {
    // template literals are strings with backticks that allow multiline strings,   string interpolation (using ${} / placeholders)
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss') // uses date-fns's format function to format the current date a specific way
    const logItem = `${dateTime}    \t${uuid()}   \t${message}\n` // stores the datetime, unique id and message to store in log
    // tabs for easy export to excel

    try{
        if(   !fs.existsSync(path.join(__dirname, '..', 'logs'))  ){ // if logs folder doesn't exist
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem) // Alt_ Z for wraparound
    }   
    catch (err){
        console.log(err)
    }

}

//now we define the above logger logic as middleware
const logger = (req, res, next) => {
    logEvents(`${req.method}    \t${req.url}    \t${req.headers.origin}`,    'reqLog.log')
     // so passing the request info to the middleware function created above with the logfile name as well 
     // BE SURE TO EDIT THIS LATER TO ONLY LOG SPECIFIC REQUESTS, IF ALL LOGGED WILL GET FULL TOO FAST
    console.log(`${req.method} ${req.path}`)
    next() // NOTE: we HAVE to call next() otherwise this middleware will hang our express server forever.
    // We can only choose to skip next if we have another escape function like res.send or res.status (for errors)
}

module.exports = {logEvents, logger} // we're exporting both a s logEvents might be used in an error handler on it's own