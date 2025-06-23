const express = require('express')
const router = express.Router()
const deliveryLettersController = require('../controllers/deliveryLettersController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT) // UNCOMMENT LATER!!! This is just for testing!!!

// sub-routes of root/delivery-letters (Done different from users and dealReportRoutes cuz of lot more get requests)

// 1. GET all delivery letters' BASE INFO with optional pagination
// Example: /api/delivery-letters?skip=0&limit=10
router.get('/', deliveryLettersController.getDeliveryLettersBaseInfo)

// 2. GET a single delivery letter in full (by ID)
router.get('/:id', deliveryLettersController.getDeliveryLetterById)

// 3. GET delivery letters filtered dynamically
// Example: /delivery-letters/filter?field=chassisNo&value=XYZ123
router.get('/search/filter', deliveryLettersController.getFilteredDeliveryLetters)

// 4. CREATE a new delivery letter (POST full letter)
router.post('/', deliveryLettersController.createDeliveryLetter)

// 5. UPDATE a delivery letter fully (PATCH full letter)
router.patch('/:id', deliveryLettersController.updateDeliveryLetter)

// 6. DELETE a delivery letter fully
router.delete('/:id', deliveryLettersController.deleteDeliveryLetter)

module.exports = router