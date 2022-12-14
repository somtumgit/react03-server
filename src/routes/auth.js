const express = require('express');
const router = express.Router();
const {signup, signin} = require('../controllers/auth');
const {requireSignin} = require('../common-middleware');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../validators/auth');

router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/signup', validateSignupRequest, isRequestValidated, signup);

router.post('/profile', requireSignin, function(req, res, next) {
    res.status(200).json({
        user: 'profile'
    });
});

module.exports = router;