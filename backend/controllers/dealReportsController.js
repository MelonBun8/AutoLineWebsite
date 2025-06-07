// we need user for deal reports too

const User = require('../models/User')
const DealReport = require('../models/DealReport')
const asyncHandler = require('express-async-handler')
// no need for bcrypt as we're not storing passwords here

// @desc GET all deal reports
// @route GET /deal-reports
// @access private
const getAllDealReports = asyncHandler( async (req, res) =>{

    const dealReports = await DealReport.find().lean()

    if(!dealReports?.length){
        return res.status(400).json({message: 'Bad Request, no deal reports found'})
    }

    // add username to the deal report mentioning who added said deal report:
    const reportsWithUser = await Promise.all(dealReports.map( async (dealReport) => {
        const user = await User.findById(dealReport.user).lean().exec()
        return { ...dealReport, username: user.username } // ... is object spread syntax, adds the data of deaReport to the sent object, not the dealReport as an object itself
    }))

    res.json(reportsWithUser)

});

// @desc create new deal report
// @route POST /deal-reports
// @access private
const createNewDealReport = asyncHandler( async (req, res) => {

    const {user, date, purchasedFrom, vehicleDetails, purchasePrice, voucherNumber, soldTo, salePrice, commissionAmount, expenses} = req.body

    // confirm the data (only the required (not optional) fields are checked to be present)
    if( !user || !date || !purchasedFrom || !vehicleDetails.make || !vehicleDetails.chassisNumber || !vehicleDetails || !purchasePrice || !soldTo || !salePrice ){ // frontend must send empty lists / 0 
        return(res.status(400).json({message: 'Bad Request, required fields missing'}))
    }

    // check if user is valid:
    const userToSave = await User.findById(user).exec()

    if(!userToSave){// not a valid user
        return(res.status(400).json({message: 'User does not exist'}))
    }

    const dealReportData = {
        user,
        date,
        purchasedFrom,
        vehicleDetails,
        purchasePrice,
        soldTo,
        salePrice,
        ...(voucherNumber && { voucherNumber }),
        ...(commissionAmount && { commissionAmount }),
        ...(expenses && { expenses }),
    };

    // Create and store the new dealReport
    const dealReport = await DealReport.create(dealReportData);

    if (dealReport) {
        res.status(201).json({ message: "New deal report created", dealReport });
    } else {
        res.status(400).json({ message: "Failed to create deal report" });
    }

});

// @desc Update a deal report
// @route PATCH /deal-reports
// @access Private
const updateDealReport = asyncHandler( async (req, res) => {
    const {id, user, date, purchasedFrom, vehicleDetails, purchasePrice, voucherNumber, soldTo, salePrice, commissionAmount, expenses} = req.body

    // Confirm data:
    if( !id || !user || !date || !purchasedFrom || !vehicleDetails || !purchasePrice || !soldTo || !salePrice ){ // frontend must send empty lists / 0 
        return(res.status(400).json({message: 'Bad Request, required fields missing'}))
    }

    // Confirm deal report exists to update:
    const dealReport = await DealReport.findById(id).exec()

    if(!dealReport){
        return res.status(400).json({message: 'Bad Request, deal report not found'})
    }

    dealReport.user = user
    dealReport.date = date
    dealReport.purchasedFrom = purchasedFrom;
    dealReport.vehicleDetails = vehicleDetails;
    dealReport.purchasePrice = purchasePrice;
    dealReport.soldTo = soldTo;
    dealReport.salePrice = salePrice;

    // Update optional fields only if they exist
    if (voucherNumber !== undefined) dealReport.voucherNumber = voucherNumber;
    if (commissionAmount !== undefined) dealReport.commissionAmount = commissionAmount; // Renaming correctly
    if (expenses !== undefined) dealReport.expenses = expenses;

    // Save updated document
    const updatedDealReport = await dealReport.save();

    res.json({ message: `Deal report with ID ${updatedDealReport._id} updated successfully` });

});

const deleteDealReport = asyncHandler( async (req, res) => {
    const {id} = req.body

    if (!id){
        return res.status(400).json({message:'Deal report ID required'})
    }

    const dealReport = await DealReport.findById(id).exec()
    
    if(!dealReport){
        return res.status(400).json({message:'No deal report exists for given ID'})
    }

    const result = await DealReport.findByIdAndDelete(id).lean().exec();
    const reply = `Deal report with ID: ${result._id} deleted`

    res.json(reply)
});

module.exports = {
    getAllDealReports,
    createNewDealReport,
    updateDealReport,
    deleteDealReport
}
 