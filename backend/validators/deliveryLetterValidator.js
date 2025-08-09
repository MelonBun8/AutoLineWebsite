const Joi = require('joi')

const deliveryLetterSchema = Joi.object({
    // 'user' field: USER ID of user
    // - Required for associating the delivery letter with a user.
    user: Joi.string().hex().length(24).required(),

    // 'srNo' field:
    // - Optional as it's auto-incremented by mongoose-sequence plugin.
    // - Joi.number() is used if it were potentially sent by the client for some reason (e.g., initial seed).
    srNo: Joi.number().optional(),

    deliveryLetterDate: Joi.date().iso().required(),

    received: Joi.boolean().required(),
    // 'carDetails' object:
    // - Required as it contains critical information about the car.
    carDetails: Joi.object({
        // 'registrationNo': Required string.
        registrationNo: Joi.string().required(),
        // 'registrationDate': Required date, expecting ISO 8601 format (e.g., "2025-01-15" or "2025-01-15T10:30:00Z").
        registrationDate: Joi.date().iso().required().allow(null),
        // Optional string fields for car details, allowing empty strings.
        chassisNo: Joi.string().required(),
        engineNo: Joi.string().optional().allow(''),
        make: Joi.string().optional().allow(''),
        model: Joi.string().optional().allow(''),
        color: Joi.string().optional().allow(''),
        hp: Joi.number().optional().allow(''),
        registrationBookNumber: Joi.string().optional().allow(''),
    }).required(), // Ensures the entire 'carDetails' object is present and validated

    // 'carDealership' object:
    // - Mandatory name and phone number of both.
    carDealership: Joi.object({

        // 'seller' object: Optional.
        sellerId: Joi.string().hex().length(24).required(),
        // 'purchaser' object: Optional.
        purchaser: Joi.object({

            name: Joi.string().optional().allow(''),
            address: Joi.string().optional().allow(''),
            tel: Joi.string().required(),
            nic: Joi.string()
            .optional()
            .messages({ // Custom error message for pattern mismatch
                'string.pattern.base': 'CNIC must be 13 digits long and contain only numbers.'
            }).allow(''),

        }).optional(),

    }).optional(), // The entire carDealership object can be omitted

    // Mongoose handles 'timestamps' (_id, createdAt, updatedAt), so no need to define them here for validation.
    // They will be added to the document by Mongoose after successful creation.

});

module.exports = deliveryLetterSchema;