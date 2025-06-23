const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const deliveryLetterSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    srNo: Number,
    membershipNo: String,
    carDetails: {
        registrationNo:{
            type: String,
            required: true
        },
        registrationDate:{
            type: Date,
            required: true
        },
        chassisNo: String,
        engineNo: String,
        make: String,
        model: String,
        color: String,
        hp: String,
        registrationBookNumber: String,
        salesCertificateNo: String,
        salesCertificateDate: Date,
        invoiceNo: String,
        invoiceDate: Date,
        cplcVerificationNo: String,
        cplcDate: Date
    },
    delivereeDetails: {
        registeredName: {
            type: String,
            required: true
        },
        address: String,
        cnic: {
            type: String,
            required: true
        },
        receiverName: { 
            type: String,
            required: true
        },
        documentDetails: String
    },
    carDealership: {
        forDealer: {
            ownerName: String,
            salesmanName: String,
            salesmanCardNo: String,
        },
        seller: {
            name: String,
            address: String,
            tel: String,
            nic: String,
            remarks: String
        },
        purchaser: {
            name: String,
            address: String,
            tel: String,
            nic: String
        }
    } 
},
{
    timestamps: true
});

deliveryLetterSchema.index({ srNo: 1 }); // the 1 is for ascending values

deliveryLetterSchema.plugin(AutoIncrement, {
    inc_field: 'srNo',
    id: 'sr_seq',
    start_seq: 2000
});

module.exports = mongoose.model('DeliveryLetter', deliveryLetterSchema);