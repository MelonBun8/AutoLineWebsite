const Joi = require('joi')

const deliveryLetterSchema = Joi.object({
    // 'user' field: USER ID of user
    // - Required for associating the delivery letter with a user.
    user: Joi.string().hex().length(24).required(),

    // 'srNo' field:
    // - Optional as it's auto-incremented by mongoose-sequence plugin.
    // - Joi.number() is used if it were potentially sent by the client for some reason (e.g., initial seed).
    srNo: Joi.number().optional(),

    // 'membershipNo' field:
    // - Optional. If sent, it must be a string. Allows an empty string.
    membershipNo: Joi.string().optional().allow(''),

    // 'carDetails' object:
    // - Required as it contains critical information about the car.
    carDetails: Joi.object({
        // 'registrationNo': Required string.
        registrationNo: Joi.string().required(),
        // 'registrationDate': Required date, expecting ISO 8601 format (e.g., "2025-01-15" or "2025-01-15T10:30:00Z").
        registrationDate: Joi.date().iso().required(),
        // Optional string fields for car details, allowing empty strings.
        chassisNo: Joi.string().optional().allow(''),
        engineNo: Joi.string().optional().allow(''),
        make: Joi.string().optional().allow(''),
        model: Joi.string().optional().allow(''),
        color: Joi.string().optional().allow(''),
        hp: Joi.string().optional().allow(''),
        registrationBookNumber: Joi.string().optional().allow(''),
        salesCertificateNo: Joi.string().optional().allow(''),
        // 'salesCertificateDate': Optional date, ISO format.
        salesCertificateDate: Joi.date().iso().optional().allow(null),
        invoiceNo: Joi.string().optional().allow(''),
        // 'invoiceDate': Optional date, ISO format.
        invoiceDate: Joi.date().iso().optional().allow(null),
        cplcVerificationNo: Joi.string().optional().allow(''),
        // 'cplcDate': Optional date, ISO format.
        cplcDate: Joi.date().iso().optional().allow(null),
    }).required(), // Ensures the entire 'carDetails' object is present and validated

    // 'delivereeDetails' object:
    // - Required.
    delivereeDetails: Joi.object({
        // 'registeredName': Required string.
        registeredName: Joi.string().required(),
        // 'address': Optional string, allows empty string.
        address: Joi.string().optional().allow(''),
        // 'cnic': Required string.
        // Custom validation: Must be exactly 13 digits and only numbers.
        cnic: Joi.string()
            .pattern(/^\d{13}$/) // Regex for exactly 13 digits
            .required()
            .messages({ // Custom error message for pattern mismatch
                'string.pattern.base': 'CNIC must be 13 digits long and contain only numbers.'
            }),
        // 'receiverName': Required string.
        receiverName: Joi.string().required(),
        // 'documentDetails': Optional string, allows empty string.
        documentDetails: Joi.string().optional().allow(''),
    }).required(),

    // 'carDealership' object:
    // - Optional overall.
    carDealership: Joi.object({
        // 'forDealer' object: Optional.
        forDealer: Joi.object({
            ownerName: Joi.string().optional().allow(''),
            salesmanName: Joi.string().optional().allow(''),
            salesmanCardNo: Joi.string().optional().allow(''),
        }).optional(),
        // 'seller' object: Optional.
        seller: Joi.object({
            name: Joi.string().optional().allow(''),
            address: Joi.string().optional().allow(''),
            tel: Joi.string().optional().allow(''),
            nic: Joi.string().optional().allow(''),
            remarks: Joi.string().optional().allow(''),
        }).optional(),
        // 'purchaser' object: Optional.
        purchaser: Joi.object({
            name: Joi.string().optional().allow(''),
            address: Joi.string().optional().allow(''),
            tel: Joi.string().optional().allow(''),
            nic: Joi.string().optional().allow(''),
        }).optional(),
    }).optional(), // The entire carDealership object can be omitted

    // Mongoose handles 'timestamps' (_id, createdAt, updatedAt), so no need to define them here for validation.
    // They will be added to the document by Mongoose after successful creation.

});

module.exports = deliveryLetterSchema;