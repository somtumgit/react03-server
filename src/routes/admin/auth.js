const express = require('express');
const router = express.Router();
const {signup, signin, signout} = require('../../controllers/admin/auth');
const {requireSignin} = require('../../common-middleware');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../../validators/auth');

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signout', requireSignin, signout);

router.post('/admin/profile', requireSignin, function(req, res, next) {
    res.status(200).json({
        user: 'profile'
    });
});

module.exports = router;