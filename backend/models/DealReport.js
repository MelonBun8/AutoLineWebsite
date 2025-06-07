const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const dealReportSchema = new mongoose.Schema({ // ctrl + d to select multiple instances of a string in the code
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    serialNumber: {
        type: Number,
        required: false
    },
    purchasedFrom: {
        type: String,
        required: true
    },
    vehicleDetails: {
        make: { type: String, required: true },
        color: { type: String, required: false, default: 'No color' },
        chassisNumber: { type: String, required: true }, // CH in CH/Region No.
        regionNumber: { type: String, required: false, default:'Not Specified' }
    },
    purchasePrice: {
        type: Number,
        required: true,
    },
    voucherNumber: {
        type: String,
        required: false,
        default: "No Voucher"
    },
    soldTo: {
        type: String, // Dr (likely debtor or dealer)
        required: true,
    },
    salePrice: {
        type: Number,
        required: true,
    },
    commissionAmount: {
        type: Number, // Cr (credit)
        required: false,
        default: 0
    },
    expenses: {
        type: Number,
        required: false,
        default: 0
    }
    }, 
    { 
        timestamps: true 
    }

);

dealReportSchema.plugin(AutoIncrement, {
    inc_field: 'serial_no',
    id: 'serialNums',
    start_seq: 1
}); // this plugin creates a separate collection called counter to maintains seq number, keeps inserting it into our DealReports


module.exports = mongoose.model('DealReport', dealReportSchema);    


