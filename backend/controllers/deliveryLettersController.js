const User = require('../models/User')
const DeliveryLetter = require('../models/DeliveryLetter')
const deliveryLetterSchema = require('../validators/deliveryLetterValidator')
const asyncHandler = require('express-async-handler')

// @desc GET all delivery letters (basic info only)
// @route GET /delivery-letters
// @access private (NOTE: All routes are private, so omitting in descriptions below)
const getDeliveryLettersBaseInfo = asyncHandler( async (req, res) => {
    const deliveryLetters = await DeliveryLetter.find().select("user srNo createdAt updatedAt").lean() // since no .save() nor getters/setters needed
    // timestamps (createdAt, updatedAt) and _id automatically included
    // if (!deliveryLetters?.length) return res.status(404).json({message: "No delivery letters found", data:[]})     
    if (!deliveryLetters?.length) return res.status(404).json({message: "No delivery letters found"})     

    // if found, also add the username of user who created the deliveryLetter
    const lettersWithUser = await Promise.all( deliveryLetters.map( async (deliveryLetter) => {
        const user = await User.findById(deliveryLetter.user).lean().exec()
        return ({...deliveryLetter, username: user.username})
    }))

    res.json(lettersWithUser)

})

// @desc GET a single delivery letter based on ID
// @route GET /delivery-letters/:id
const getDeliveryLetterById = asyncHandler( async (req, res) => {
    
    const letterId = req.params.id

    const deliveryLetter = await DeliveryLetter.findById(letterId).lean().exec()

    if (!deliveryLetter) return res.status(404).json({message: "Delivery Letter does not exist"})
    
    res.json(deliveryLetter)

})

// @desc GET delivery letters filtered on some field + its value
// @route GET /delivery-letters/search/filter
const getFilteredDeliveryLetters = asyncHandler( async (req, res) => {
    
    const { field, value } = req.query
    if(!field || !value){
        return res.status(400).json({message:"Missing 'field' or 'value' query parameters for filtering"})
    }

    const allowedFilterFields = ['srNo','carDealership.seller.name','carDealership.purchaser.name','carDetails.chassisNo','carDetails.registrationNo']
    if(!allowedFilterFields.includes(field)){
        return res.status(400).json({message: `Invalid filter field ${field} Allowed fields are: ${allowedFilterFields.join(', ')}`})
    }
    
    let queryValue = value; 
    const caseInsensitiveFields = ['carDealership.seller.name','carDealership.purchaser.name','carDetails.chassisNo','carDetails.registrationNo'];

    if (caseInsensitiveFields.includes(field)) {
        queryValue = { $regex: new RegExp(value, 'i') }; //regexp for case-insensitivity
    } else if (field === 'srNo') {  
        queryValue = Number(value);
        if (isNaN(queryValue)) { // Add check for valid number conversion
            return res.status(400).json({ message: `Invalid value for 'srNo'. Must be a number.` });
        }
    }

    const filteredLetters = await DeliveryLetter.find({[field]: queryValue}).select("user srNo createdAt updatedAt").lean().exec();

    if (!filteredLetters?.length) {
        return res.status(200).json({ message: 'No delivery letters found matching the filter criteria.', data: [] });
    }

    res.json(filteredLetters)

})

// @desc create new delivery letter
// @route POST /delivery-letters
const createDeliveryLetter = asyncHandler( async (req, res) => {

    const { username, ...data } = req.body;
    
    const user = await User.findOne({ username }).lean().exec();
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    // validating the fields using a Joi middleware validator
    // NOTE: you're destructuring what the .validate of Joi returns, you CAN'T call it anything but value, you can later rename it to something else but eh.. not gonna bother.

    const { error, value: validatedLetter } = deliveryLetterSchema.validate({user:user._id.toString(), ...data}, {abortEarly: false}); // to return ALL errors, not jsut first.
    // Note, value holds the validated object if there's no errors found
    // ALSO, mongoDB automatically typecasts our string back to objectId when saving
    
    if (error) {
        // With joi, each detail in errors will have error string message, path in JSON where error happend, validation type, more validation rule context. (we're taking only message and path)
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, '') // use regex to remove all double quotes slashes for delimiting the ", and g for global/ all instances, not just the first.
        })) // NOTE that the arrow function allows you to omit and have implicit returns, and since we have an object literal, we must wrap it in () to prevent misinterpretation as a block scope
        console.log(errors)
        return res.status(400).json({
            message: 'Validation failed for create',
            errors: errors
        })
    }

    const newDeliveryLetter = await DeliveryLetter.create(validatedLetter)

    if(newDeliveryLetter){
        res.status(201).json({ message: "New delivery letter created", newDeliveryLetter })
    } else {
        res.status(500).json({ message: "Failed to create delivery letter" });
    }

})

// @desc update a delivery letter
// @route PATCH /delivery-letters/:id
const updateDeliveryLetter = asyncHandler( async (req, res) => {
    
    const  id = req.params.id
    const deliveryLetter = req.body
    console.log(deliveryLetter)
    
    const deliveryLetterExists = await DeliveryLetter.findById(id).lean().exec()
    if(!deliveryLetterExists){
        return(res.status(404).json({message: 'Bad Request. Delivery Letter does not exist'}))
    }

    deliveryLetter.user = deliveryLetterExists.user.toString()

    const { error, value: validatedLetter } = deliveryLetterSchema.validate(deliveryLetter, {abortEarly: false}); 
    if (error) {
        console.log("Some error found with the frontend data!")
        console.log(error)
        
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, '') 
        })) 
        return res.status(400).json({
            message: 'Validation failed for update',
            errors: errors
        })
    }
    const updatedDeliveryLetter = await DeliveryLetter.findByIdAndUpdate(id, validatedLetter, {new:true, runValidators:true}).lean().exec()

    if(updatedDeliveryLetter){
        res.status(200).json({ message: "Delivery Letter updated successfully", updatedDeliveryLetter })
    } else {
        res.status(500).json({ message: "Failed to create deal report" });
    }
})

// @desc delete a delivery letter
// @route DELETE /delivery-letters/:id
const deleteDeliveryLetter = asyncHandler( async (req, res) => {
    const id = req.params.id

    const deliveryLetterToDelete = await DeliveryLetter.findById(id).exec()
    
    if(!deliveryLetterToDelete){
        return res.status(404).json({message:'No delivery letter exists for given ID'})
    }

    const result = await DeliveryLetter.findByIdAndDelete(id).lean().exec();
    const reply = `Delivery Letter with ID: ${result._id} deleted`

    res.json({message:reply})
})

module.exports = {
    getDeliveryLettersBaseInfo,
    getDeliveryLetterById,
    getFilteredDeliveryLetters,
    createDeliveryLetter,
    updateDeliveryLetter,
    deleteDeliveryLetter
}