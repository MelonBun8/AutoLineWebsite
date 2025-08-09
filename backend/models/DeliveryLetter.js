const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const deliveryLetterSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    srNo: Number,
    received: {
        type: Boolean,
        required: true
    },
    deliveryLetterDate: {
        type: Date,
        required: true,
    },
    carDetails: {
        chassisNo: {
            type: String,
            required: true
        },
        registrationNo: String,
        registrationDate: Date,
        engineNo: String,
        make: String,
        model: String,
        color: String,
        hp: Number,
        registrationBookNumber: String,
    },
    carDealership: {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Seller'
        },
        purchaser: {
            name: {
                type: String,
                required: true
            },
            address: String,
            tel: {
                type: String,
                required: true
            },
            nic: String
        }
    } 
},
{
    timestamps: true
});

deliveryLetterSchema.index({ srNo: 1 }); // the 1 is for ascending values
deliveryLetterSchema.index({ deliveryLetterDate: -1 }); // Descending for recent first / indexing for faster sorting

deliveryLetterSchema.plugin(AutoIncrement, {
    inc_field: 'srNo',
    id: 'sr_seq',
    start_seq: 2000
});

module.exports = mongoose.model('DeliveryLetter', deliveryLetterSchema);