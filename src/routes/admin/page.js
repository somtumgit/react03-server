const express = require('express');
const router = express.Router();
const { createPage, getPage } = require('../../controllers/admin/page');
const {requireSignin, upload, adminMiddleware} = require('../../common-middleware');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../../validators/auth');


router.post('/page/create', requireSignin, adminMiddleware, upload.fields([
    {name: 'banners'},
    {name: 'products'}
]), createPage);

router.get('/page/:cid/:type', getPage);


module.exports = router;

