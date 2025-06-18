// for a controller for users, we need the user model   
const User = require('../models/User')
const DealReport = require('../models/DealReport') // since we might need to access this collection for some user operations
const asyncHandler = require('express-async-handler') // stops need for too many try/catch blocks as we use async methods with mongoose
// basically handles the errors more elegantly (WIKI: Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.)
const bcrypt = require('bcrypt') // to hash / encrypt a password before saving it into a database (We never store plaintext passwords)

// BY THE WAYYYY, there is an easier alternative to express-async handler that doesn't require every handler to be wrapped in 
// asyncHandler, it's called 'express-async-errors'. Then all you need to do is require it in server.js. EASY!
// it would then just be for example: const getAllUsers = async (req,res) => {.....}

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {// notice no next() since we'll be sending back response (Implicitly does it anyways), removing the need for explicit next() call (Also can think of it as 'end of the line')

    const users = await User.find().select('-password').lean() // the -password ensures password is not returned from the users collection
    // lean ensures mongoose doesn't give a whole document with methods like save
    // using lean means none of the following: Change tracking, Casting and validation, Getters and setters, Virtuals, save() function
    if(!users){
        return res.status(400).json({message:'No users found'}) // res.status is an exiting command that ensures we don't need next()   
        // return is not necessary but it adds safety in case of errors
    }
    res.json(users) // this is also exiting
})

// @desc Create new user
// @route POST at '/users' endpoint/route/url path
// @access Private
const createNewUser = asyncHandler(async (req, res) => {

    const { username, password, roles } = req.body // extracting data from the request
    
    // Confirm data
    if (!username || !password){
        return res.status(400).json({ message: 'Bad request. All fields are required' }) // these are explicit handling for specific errors, other non-specified errors are handled by async error handler and go to our defined error handling middleware
    } // we explicitly create error handling for this error because we want it to show on our frontend
    
    // Check for duplicates in database
    const duplicate = await User.findOne({ username }).collation({locale:'en', strength:2}).lean().exec() 
    // collation enfoces case insensitivity (There cannot be 2 'Nomaan's) 
    // we call exec when we're passing data into the query (it also returns promise, which is helpful)

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 salt rounds to encrypt the password

    const userObject = (!Array.isArray(roles) || !roles.length) // if variable name is same as key, you can just specify the key and it'll be auto destructured (this is called object literal shorthand)
    ? {username, "password":hashedPwd} // if user does not specify roles, do not send roles object, default "employee" used
    : {username, "password":hashedPwd, roles}
    // Create and store new user
    const user = await User.create(userObject)

    if (user) {// if user created successfully in DB
        res.status(201).json({ message: `New user ${username} created`}) // no return as end of backend chain    
    }
    else{
        res.status(400).json({ message: 'Invalid user data recieved, user not created.' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {

    const {id, username, roles, active, password} = req.body

    // Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active != 'boolean'){
        return res.status(400).json({ message: 'Bad request. All fields are required'})
    }

    const user = await User.findById(id).exec() // not calling lean since we DO want hte mongoose document with save functions etc.

    if(!user){ // if the user to update doens't exist
        return res.status(400).json({message: 'User not found'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({username}).collation({ locale: 'en', stregth: 2}).lean().exec() // note it is an object being sent in findOne, uses object literal shorthand for username in this case. 

    // Allow updates to original user, not other duplicates with the same name, also no allowing user to change to preexisting username
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    // we are now editing the mongoose document
    user.username = username
    user.roles = roles
    user.active = active

    if (password){
        // hash the updated password
        user.password = await bcrypt.hash(password, 10) 
    }
    
    const updatedUser = await user.save() // this is why we didn't use the lean()
    // any issues with above execution will be caught by async handler, so no need for try catch

    res.json({message: `${updatedUser.username} updated`})
})
// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

    const {id} = req.body

    if(!id){
        return res.status(400).json({message: 'User ID Required'})
    }

    const dealReport = await DealReport.findOne({ user: id}).lean().exec()

    if(dealReport){ // dealReport?.length would be optional chaining to safely check the property of an object without crashing if the propoerty may be undefined
        // returns undefined instead of crashing (Not used here since it's just one object from findOne)
        return res.status(400).json({message: 'User has created deal reports'})
    }

    const user = await User.findById(id).exec()

    if (!user){
        return res.status(400).json({message: 'User not found'})
    }

    const result = await User.findByIdAndDelete(id).lean().exec(); // deletes and returns deleted user's info
    // NOT IN TUTORIAL, it's changed now

    const reply = `Username: ${result.username} with ID: ${result._id} deleted`

    res.json(reply)
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
