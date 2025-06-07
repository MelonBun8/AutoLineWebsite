const express = require('express')
const router = express.Router() // modular route handler
const path = require('path')

// matches /, /index, and /index.html ( A RESTful GET Request for the index page returns the index.html file!!)
router.get('^/$|/index(.html)?', (req, res) => 
    // 
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))

) // using regex, must begin with slash OR can be /index with OPTIONAL .html 

module.exports = router