const Category = require('../../models/category');
const Product = require('../../models/product');
const Page = require('../../models/page');


exports.createPage = function(req, res, next) {
    // const {banners: bannersFile, products: productsFile} = req.files;
    // console.log(req.body.banners);
    // console.log(req.files);
    // console.log(!banners);
    // console.log(banners);
    // console.log(products);
    if (req.files.banners == null) { 
        req.body.banners = [];
    }else if(req.files.banners.length > 0) {
        const {banners: bannersFile} = req.files;
        req.body.banners = bannersFile.map((banner, index) => ({
            img: `/public/${banner.filename}`,
            navigateTo: `/bannerClicked?categoryId=${req.body.categoryId}&type=${req.body.type}`
        }));
    }
    
    if (req.files.products == null) { 
        req.body.products = [];
    }else if(req.files.products.length > 0) {
        const {products: productsFile} = req.files;
        req.body.products = productsFile.map((product, index) => ({
            img: `/public/${product.filename}`,
            navigateTo: `/productClicked?categoryId=${req.body.categoryId}&type=${req.body.type}`
        }));
    }
    
    // console.log(req.body.banners);
    // console.log(req.body.products);

    req.body.createdBy = req.user._id;
    const {title, description, banners, products, category, createdBy} = req.body;

    Page.findOne({category: category})
    .exec(function(error, page) {
        if(error) {
            return res.status(400).json({
                error: error
            });
        } 
        // console.log(page);
        if(page) {
            Page.findOneAndUpdate({category: category},{
                title: title,
                description: description,
                banners: banners,
                products: products,
                category: category,
                createdBy: createdBy
            }).exec(function(error, updatedPage) {
                if(error) {
                    return res.status(400).json({
                        error: error
                    });
                } 
                if(updatedPage) {
                    return res.status(201).json({
                        message: 'Page updated successfully!',
                        page: updatedPage
                    });
                }

            })
        }else {
            const page = new Page({
                title: title,
                description: description,
                banners: banners,
                products: products,
                category: category,
                createdBy: createdBy
            });

            page.save(function(error, page) {
                if(error) {
                    return res.status(400).json({
                        error: error
                    });
                } 
        
                if(page) {
                    return res.status(201).json({
                        message: 'Page added successfully!',
                        page: page
                    });
                }
            });
        }
    });
    
}

exports.getPage = function(req, res, next) {
    const { cid, type } = req.params;
    // console.log(cid);
    // console.log(type);
    if(type == "page") {
        Page.findOne({category: cid})
        .exec(function(error,page) {
            if(error) {
                return res.status(400).json({
                    error: error
                });
            }
            if(page) {
                return res.status(200).json({
                    page: page
                });
            }
        });
    }
}


