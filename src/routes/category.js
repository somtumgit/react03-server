const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const router = express.Router();
const { addCategory, getCategory, updateCategories, deleteCategories } = require('../controllers/category');
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

const upload = multer({ storage });

router.post('/category/create', requireSignin, adminMiddleware, upload.single('categotyImage'), addCategory);
router.get('/category/get', getCategory);
router.post('/category/update', upload.array('categotyImage'), updateCategories);
router.post('/category/delete', deleteCategories);

module.exports = router;