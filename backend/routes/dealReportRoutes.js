const express = require('express')
const router = express.Router()
const dealReportsController = require('../controllers/dealReportsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT) // verifyJWT middleware is applied to all below routes

// now this file assumes we are already in the /deal-reports path, we further define HTTP requests to this path
router.route('/')
    .get(dealReportsController.getAllDealReports)
    .post(dealReportsController.createNewDealReport)
    .patch(dealReportsController.updateDealReport)
    .delete(dealReportsController.deleteDealReport)


module.exports = router
