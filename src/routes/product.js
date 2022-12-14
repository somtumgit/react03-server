const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const router = express.Router();
const { addProduct, getProduct, getProductBySlug, getProductDetailById, deleteProductById } = require('../controllers/product');
const multer = require('multer');
const path = require('path');
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, shortid.generate() + '-' + file.originalname);
    }
})

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), addProduct);
router.get('/product/get', getProduct);
router.get('/product/:slug', getProductBySlug);
router.get('/product-detail/:productId', getProductDetailById);
router.delete('/product/deleteProductById', requireSignin, adminMiddleware, deleteProductById);

module.exports = router;