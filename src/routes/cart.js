const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const router = express.Router();
const { addItemToCart, getItemCart, removeCartItems } = require('../controllers/cart');

router.post('/user/cart/addItemToCart', requireSignin, userMiddleware, addItemToCart);
router.get('/user/cart/getItemCart', requireSignin, userMiddleware, getItemCart);
router.post('/user/cart/removeItem', requireSignin, userMiddleware, removeCartItems);

module.exports = router;
