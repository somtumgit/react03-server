const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, min:3, max:50},
    phone: {type: String, required: true, trim: true},
    pinCode: {type: String, required: true, trim: true},
    locality: {type: String, required: true, trim: true, min:10, max:100},
    address: {type: String, required: true, trim: true, min:10, max:100},
    cityDistrictTown: {type: String, required: true, trim: true},
    state: {type: String, required: true, trim: true},
    landmark: {type: String, trim: true, min:10, max:100},
    alternatePhone: {type: String, trim: true},
    addressType: {type: String, required: true, enum: ['home','work']},
    
});

const userAddressSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    address: [addressSchema]
}, {timestamps: true});

module.exports = mongoose.model('UserAddress', userAddressSchema);





