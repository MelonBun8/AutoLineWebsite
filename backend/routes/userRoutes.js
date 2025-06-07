const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT) // verifyJWT middleware is applied to all below routes
 
// further routing from /users. Below assumes we already are at /users route
router.route('/') // we will route to different controllers for each REST Method
    .get(usersController.getAllUsers) 
    .post(usersController.createNewUser)
    .patch(usersController.updateUser) // update for CRUD
    .delete(usersController.deleteUser)

module.exports = router