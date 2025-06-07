const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    roles:[{ // wrapped in an array as a user may have more than one role
        type: String,
        default:'Employee'
    }],
    active:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)