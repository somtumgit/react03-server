const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    cartItems: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, default: 1, required: true},
            price: {type: Number, required: true}
        }
    ]
    
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);