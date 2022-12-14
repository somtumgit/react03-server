const Category = require('../../models/category');
const Product = require('../../models/product');
const Order = require("../../models/order");

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
            parentId: cate.parentId,
            categotyImage: cate.categotyImage,
            type: cate.type,
            children: createCategories(categories,cate._id)
        });
    }

    // console.log(categoryList);

    return categoryList;
}

exports.initialData = async function(req, res, next) {
    // console.log('initialData');
    const categories = await Category.find({}).exec();
    const products = await Product.find({})
    // .select('_id name category')
    // .populate('category')
    .populate({path: 'category', select: '_id name'})
    .exec();
    const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();

    const categoryList = createCategories(categories);

    return res.status(200).json({
        categoryList: categoryList,
        products: products,
        orders: orders
    });
};