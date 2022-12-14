const Cart = require('../models/cart');
const Product = require('../models/product');
const slugify = require('slugify');
const { use } = require('../routes/cart');


exports.addItemToCart = function(req,res) {
    const cartItems = req.body.cartItems;
    // console.log(cartItems);
    Cart.find({userId: req.user._id})
    .exec(function(error, cart) {
        // console.log(cart);
        if(error) {
            return res.status(400).json({
                error: error
            });
        }
        if(cart.length > 0) {
            // console.log(cart);
            const productId = req.body.cartItems[0].productId;
            let item = [];
            // console.log(cartItems);
            // console.log(productId);
            cart[0].cartItems.forEach((cartItem) => {
                // console.log(cartItem);
                if(cartItem.productId == productId) {
                    item = [cartItem];
                    // console.log(cartItem);
                }
                
            });
            
            let condition, update;
            
            // console.log('item',item);
            // console.log('item',item.length);
            // console.log('item',item.quantity);
            // console.log('item',req.body.cartItems[0]);
            
            if(item.length > 0) {
                condition = {"userId": req.user._id, "cartItems.productId": productId};
                update = {"$set": {"cartItems.$": {
                    ...req.body.cartItems[0]
                    // productId: item.productId,
                    // price: item.price,
                    // quantity: req.body.cartItems[0].quantity
                }}};
                Cart.findOneAndUpdate(condition, update)
                .exec(function(error, _cart) {
                    if(error) {
                        return res.status(400).json({
                            error: error
                        });
                    }
                    if(_cart) {
                        Cart.find({userId: req.user._id})
                        .exec(function(error, __cart) {
                            if(error) return res.status(400).json({error});
                            if(__cart) {
                                return res.status(201).json({
                                    cart: __cart
                                });
                            }
                        });
                    }
                });
            }else {
                // console.log('123');
                // console.log(req.body.cartItems);
                condition = {userId: req.user._id};
                update = {"$push": {"cartItems": req.body.cartItems}};
                Cart.findOneAndUpdate(condition, update)
                .exec(function(error, _cart) {
                    if(error) {
                        return res.status(400).json({
                            error: error
                        });
                    }
                    if(_cart) {
                        
                        Cart.find({userId: req.user._id})
                        .exec(function(error, __cart) {
                            if(error) return res.status(400).json({error});
                            if(__cart) {
                                return res.status(201).json({
                                    cart: __cart
                                });
                            }
                        });
                    }
                });
            }
            
        }else {
            const cart = new Cart({
                userId: req.user._id,
                cartItems: cartItems
            });
            // console.log(cart);
        
            cart.save(function(error,cart) {
                if(error) {
                    return res.status(400).json({
                        error: error
                    });
                }
                if(cart) {
                    return res.status(201).json({
                        cart: cart
                    });
                }
            });
        }
    });

    

    
}

exports.getItemCart = function(req,res) {
    
    Cart.find({userId: req.user._id})
    .exec(async function(error, carts) {
        if(error) {
            return res.status(400).json({
                error: error 
            });
        }

        if(carts.length > 0) {
            
            const createCartItems = async () => { 
                // console.log(carts); 
                let items = {};
                for (const cart of carts[0].cartItems) {    
                    const productData = await Product.find({_id: cart.productId});
                    let name = productData[0].name;
                    let img = productData[0].productPictures.length > 0 ? productData[0].productPictures[0].img : null;
                    items[cart.productId] = {
                        _id: cart.productId,
                        name: name,
                        img: img,
                        price: cart.price,
                        qty: cart.quantity
                    }

                    // console.log('items',items);
                };
                // console.log(items);
                return items;
            }

            const cartItems = await createCartItems();

            // console.log(cartItems);
            // console.log('I will wait');

            
            res.status(200).json({
                cart: carts,
                cartItems: cartItems
            });
        }else {
            res.status(200).json({
                cart: [],
                cartItems: {}
            });
            // return res.status(400).json({
            //     error: error 
            // });
        }
    });
}

exports.removeCartItems = (req, res) => {
    const { productId } = req.body.payload;
    console.log(productId);
    console.log(req.user._id);
    if (productId) {
        Cart.updateOne(
            { userId: req.user._id },
            {
                $pull: {
                    cartItems: { productId : productId }
                }
            }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
            res.status(202).json({ result });
            }
        });
    }
}