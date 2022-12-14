const Category = require('../models/category');
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
            parentId: cate.parentId,
            categotyImage: cate.categotyImage,
            type: cate.type,
            children: createCategories(categories,cate._id)
        });
    }

    // console.log(categoryList);

    return categoryList;
}

exports.addCategory = function(req,res) {

    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`
    }

    // console.log(req.file);
    if(req.file) {
        categoryPicture = req.file.filename;
        categoryObj.categotyImage = categoryPicture;
    }
    
    if(req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }
    console.log(categoryObj);
    const newCategory = new Category(categoryObj);
    newCategory.save(function(error, category) {
        if(error) {
            if ( error && error.code === 11000 ) {
                let message = 'Category already exists';
                return res.status(400).json({
                    error: message 
                });
            } else {
                return res.status(400).json({
                    error: error 
                });
            }
            
        }

        if(category) {
            return res.status(201).json({
                message: "Category added successfully!",
                category: category
            });
        }
    });
}

exports.getCategory = function(req,res) {
    Category.find({})
    .exec(function(error, categories) {
        if(error) {
            return res.status(400).json({
                error: error 
            });
        }

        if(categories) {
            const categoryList = createCategories(categories);
            // console.log(categoryList);
            res.status(200).json({
                categoryList: categoryList,
                // categories: categories
            });
        }
    });
}

exports.updateCategories = async function(req,res) {
    const {_id,name,parentId,type} = req.body;
    console.log(_id);
    console.log(name);
    console.log(parentId);
    console.log(type);
    console.log(name instanceof Array);
    const updatedCategories = [];
    if(name instanceof Array) {
        for(let i=0; i < name.length; i++) {
            const category = {
                name: name[i],
                type: type[i]
            }
            if(parentId == "") {
                category.parentId = parentId[i];
            }

            const updatedCategory = await Category.findOneAndUpdate({
                _id: _id[i]
            }, category, {new: true});
            updatedCategories.push(updatedCategory);
        }

        console.log(updatedCategories);
        return  res.status(201).json({
            updatedCategories: updatedCategories
        })
    }else {
        const category = {
            name: name,
            type: type
        };
        if(parentId != "") {
            category.parentId = parentId;
        }

        const updatedCategory = await Category.findOneAndUpdate({
                _id: _id
        }, category, {new: true});
        updatedCategories.push(updatedCategory);

        return  res.status(201).json({
            updatedCategories: updatedCategories
        })
    }
    
}

exports.deleteCategories = async function(req,res) {
    ids = req.body;
    console.log(ids);
    const deletedCategories = [];
    for(let i=0; i < ids.length; i++) {
        const deleteCategory = await Category.findOneAndDelete({
            _id: ids[i]._id
        },);
        deletedCategories.push(deleteCategory);
    }

    if(deletedCategories.length == ids.length) {
        res.status(200).json({
            message: 'Categories removed!'
        });
    }else {
        res.status(400).json({
            message: 'Something went wronge!'
        });
    }
    
}



