const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    tel: { type: String, required: true },
    nic: String,
    remarks: String,
}, 
    {timestamps: true}
)

module.exports = mongoose.model('Seller', sellerSchema)