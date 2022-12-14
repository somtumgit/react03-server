const Category = require('../models/category');
const Product = require('../models/product');
const slugify = require('slugify');
const shortid = require('shortid');

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    // console.log(categories);
    if(parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined );
        // console.log(category);
    }else {
        category = categories.filter(cat => cat.parentId == parentId );
        // console.log(category);
    }
    
    for(let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories,cate._id)
        });
    }

    return categoryList;
}

exports.addProduct = function(req,res) {
    let productPictures = [];
    if(req.files.length > 0) {
        productPictures = req.files.map(function(file) {
            return {img: file.filename}
        });
    }

    const product = new Product({
        name: req.body.name,
        slug: slugify(req.body.name),
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        offer: 0,
        productPictures: productPictures,
        // reviews: [{userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, review: String }],
        reviews: null,
        category: req.body.category,
        createdBy: req.user._id,
        updatedAt: new Date(),
    });
    console.log(product);
    product.save(async function(error,product) {
        
        if(error) {
            return res.status(400).json({
                error: error
            });
        }
        if(product) {
            const productData = await Product.find({_id:product._id})
            // .select('_id name category')
            // .populate('category')
            .populate({path: 'category', select: '_id name'})
            .exec();
            return res.status(201).json({
                message: 'Product added successfully!',
                product: productData
            });
        }
    });

    
}

exports.getProduct = function(req,res) {
    Product.find({})
    .populate({path: 'category', select: '_id name'})
    .exec(function(error, products) {
        if(error) {
            return res.status(400).json({
                error: error 
            });
        }

        if(products) {
            // const categoryList = createCategories(categories);
            // console.log(categoryList);
            res.status(200).json({
                products: products,
                // categories: categories
            });
        }
    });
}

exports.getProductBySlug = function(req,res) {
    const {slug} = req.params;
    Category.findOne({slug: slug})
    .exec(function(error, category) {
        if(error) {
            return res.status(400).json({
                error: error
            })
        }

        if(category) {
            Product.find({category: category._id})
            .exec(function(error, products) {
                if(error) {
                    return res.status(400).json({
                        error: error
                    })
                }

                if(products) {
                    res.status(200).json({
                        products: products,
                        priceRange: {
                            under5k: 5000,
                            under10k: 10000,
                            under15k: 15000,
                            under20k: 20000,
                            upper20k: 20000,
                        },
                        productsByPrice: {
                            under5k: products.filter(function(product) {
                                return product.price <= 5000
                            }),
                            under10k: products.filter(function(product) {
                                return product.price > 5000 && product.price <= 10000
                            }),
                            under15k: products.filter(function(product) {
                                return product.price > 10000 && product.price <= 15000
                            }),
                            under20k: products.filter(function(product) {
                                return product.price > 15000 && product.price <= 20000
                            }),
                            upper20k: products.filter(function(product) {
                                return product.price > 20000
                            })
                        } 
                    });
                }else {
                    return res.status(400).json({
                        error: `This ${slug} slug not have product!`
                    })
                }
               
            });
            
        }else {
            return res.status(400).json({
                error: `This ${slug} slug not found!`
            })
        }
    });
    
}

exports.getProductDetailById = function(req,res) {
    const { productId } = req.params;
    if(productId) {
        Product.findOne({_id:productId})
        .exec((error,product) => {
            if(error) {
                return res.status(400).json({
                    error: error
                });
            }
            if(product) {
                res.status(200).json({
                    product: product
                })
            }
        });
    }else {
        return res.status(400).json({
            error: 'Params required!'
        });
    }
}

exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
      Product.deleteOne({ _id: productId }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  };