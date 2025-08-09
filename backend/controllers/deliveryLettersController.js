const User = require('../models/User')
const Seller = require('../models/Seller')
const DeliveryLetter = require('../models/DeliveryLetter')
const deliveryLetterSchema = require('../validators/deliveryLetterValidator')
const asyncHandler = require('express-async-handler')

// @desc GET all delivery letters (basic info only)
// @route GET /delivery-letters
// @access private (NOTE: All routes are private, so omitting in descriptions below)
const getDeliveryLettersBaseInfo = asyncHandler( async (req, res) => {
    console.log("BaseInfo")
    const deliveryLetters = await DeliveryLetter
    .find()
    .sort({deliveryLetterDate:-1}) // descending order, latest first
    .limit(10)
    .select("user srNo createdAt updatedAt")
    .lean() // since no .save() nor getters/setters needed
    // timestamps (createdAt, updatedAt) and _id automatically included
    // if (!deliveryLetters?.length) return res.status(404).json({message: "No delivery letters found", data:[]})     
    if (!deliveryLetters?.length) return res.status(404).json({message: "No delivery letters found"})     

    // if found, also add the username of user who created the deliveryLetter
    const lettersWithUser = await Promise.all( deliveryLetters.map( async (deliveryLetter) => {
        const user = await User.findById(deliveryLetter.user).lean().exec()
        return ({...deliveryLetter, username: user.username})
    }))
    console.log("Printing base deliveryLetter IDs:")
    Object.values(lettersWithUser).forEach(letter => {
        console.log(`The _id is: ${letter._id}`);
    });
    res.json(lettersWithUser)

})

// @desc GET a single delivery letter based on ID
// @route GET /delivery-letters/:id
const getDeliveryLetterById = asyncHandler( async (req, res) => {
    
    const letterId = req.params.id

    const deliveryLetter = await DeliveryLetter.findById(letterId).populate('carDealership.sellerId').lean().exec()
    // .populate() is a mongoose operation that 'populates' your id reference (In our case, sellerId), with the full object, thus making all fields of that referenced object accessible. In this case, we can now do carDealership.sellerId.tel etc.

    if (!deliveryLetter) return res.status(404).json({message: "Delivery Letter does not exist"})
    
    res.json(deliveryLetter)

})

// @desc GET delivery letters filtered on some field + its value
// @route GET /delivery-letters/search/filter
const getFilteredDeliveryLetters = asyncHandler( async (req, res) => {
    
    console.log("filteredLetters")
    const { field, value } = req.query
    if(!field || !value){
        return res.status(400).json({message:"Missing 'field' or 'value' query parameters for filtering"})
    }

    const allowedFilterFields = ['srNo','carDealership.seller.name','carDealership.purchaser.name','carDetails.chassisNo','carDetails.registrationNo']

    if(!allowedFilterFields.includes(field)){
        return res.status(400).json({message: `Invalid filter field ${field} Allowed fields are: ${allowedFilterFields.join(', ')}`})
    }

    let queryValue = value
    const caseInsensitiveFields = ['carDealership.seller.name','carDealership.purchaser.name','carDetails.chassisNo','carDetails.registrationNo']

    if (caseInsensitiveFields.includes(field)) {
        queryValue = { $regex: new RegExp(value, 'i') }; //regexp for case-insensitivity
    } else if (field === 'srNo') {  
        queryValue = Number(value);
        if (isNaN(queryValue)) { // Add check for valid number conversion
            return res.status(400).json({ message: `Invalid value for 'srNo'. Must be a number.` });
        }
    }


    // since we have to join two collections (seller + deliveryLetters) AND filter by seller name, we use .aggregate(), different from populate() or .find(). Aggregate lets you run a series of pipeline operations on documents. It is mainly used when you need to Join, and run searches, filters, and sorts on joined data. It is a raw mongoDB query, and not mongoose specific (unlike pupulate)
     
    let matchStage = {}
    const pipeline = []

    if (field === 'carDealership.seller.name'){
        pipeline.push(
            { // first step in our pipeline, $lookup. This joins sellers collection to resolve carDealership.sellerId
                $lookup:{
                    from: 'sellers',
                    localField: 'carDealership.sellerId',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            { $unwind: '$seller' }, // seller array is converted to an object so seller.name can be accessed
            {
                $match:{ // filter like .find()
                    'seller.name': queryValue
                }
            }
        );
    }
    else{
        matchStage[field] = queryValue;
        pipeline.push({ $match: matchStage });
    }

    pipeline.push({ $sort: { deliveryLetterDate: -1 } });
    // $lookup stage to get the user information
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo' // Use a temporary field name to avoid overwriting 'user'
        }
    });

    // We don't need to unwind if we only need one field.
    // Instead, we can use $project to extract the username from the first element of the 'userInfo' array.

    pipeline.push({
        $addFields: {
            // $arrayElemAt: ['<array>', <index>] returns the element at the specified index.
            // In our case, the userInfo array will only have one element (or zero if no match)
            username: { $arrayElemAt: ['$userInfo.username', 0] }
        }
    });
     pipeline.push({ // limits returned fields to only what the UI needs
        $project: {
            user: 1,
            srNo: 1,
            createdAt: 1,
            updatedAt: 1,
            username: 1
        }
    });
    
    const filteredLetters = await DeliveryLetter.aggregate(pipeline);

    if (!filteredLetters?.length) {
        return res.status(200).json({ message: 'No delivery letters found matching the filter criteria.', data: [] });
    }

    console.log("Printing filtered deliveryLetter IDs:")
    Object.values(filteredLetters).forEach(letter => {
        console.log(`The _id is: ${letter._id}`);
    });
    res.json(filteredLetters)

})

// @desc create new delivery letter
// @route POST /delivery-letters
const createDeliveryLetter = asyncHandler( async (req, res) => {

    const { username, isAutoline, sellerName, sellerPhone, sellerAddress, sellerCNIC, sellerRemarks, ...data } = req.body;
    console.log(data)
    const user = await User.findOne({ username }).lean().exec();
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    let seller;

    if (isAutoline) {
        console.log("INSIDE isAUTOLINE PATH")
        seller = await Seller.findOne({ name: "Autoline" }).lean().exec();
        if (!seller) {
            seller = await Seller.create({
                name: "Autoline",
                tel: "0213-4860058",
                address: "New M.A. Jinnah Rd.",
                nic:"",
                remarks:""
            });
        }
    } else {
        
        console.log("INSIDE NOT isAUTOLINE PATH")
        seller = await Seller.findOne({ name: sellerName }).lean().exec();
        if (!seller) {
            seller = await Seller.create({
                name: sellerName,
                address: sellerAddress,
                tel: sellerPhone,
                nic: sellerCNIC
            });
        }
    }

    let toValidate = {user:user._id.toString(),  ...data}
    toValidate.carDealership.sellerId = seller._id.toString()
    toValidate.deliveryLetterDate = new Date(`${toValidate.deliveryLetterDate}:00Z`);
    // validating the fields using a Joi middleware validator
    // NOTE: you're destructuring what the .validate of Joi returns, you CAN'T call it anything but value, you can later rename it to something else but eh.. not gonna bother.
    const { error, value: validatedLetter } = deliveryLetterSchema.validate(toValidate, {abortEarly: false}); // to return ALL errors, not jsut first.
    // Note, value holds the validated object if there's no errors found
    // ALSO, mongoDB automatically typecasts our string back to objectId when saving
    
    if (error) {
        
        console.log("ERROR WITH JOI VALIDATION!")
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
    
    const deliveryLetterExists = await DeliveryLetter.findById(id).lean().exec()
    if(!deliveryLetterExists){
        return(res.status(404).json({message: 'Bad Request. Delivery Letter does not exist'}))
    }

    delete deliveryLetter.carDealership.seller
    delete deliveryLetter.deliveryLetterDate_date
    delete deliveryLetter.deliveryLetterDate_time
    deliveryLetter.carDealership.sellerId = deliveryLetterExists.carDealership.sellerId.toString()
    deliveryLetter.user = deliveryLetterExists.user.toString()
    deliveryLetter.deliveryLetterDate = new Date(`${deliveryLetter.deliveryLetterDate}:00Z`);
    
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

    console.log(validatedLetter)
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