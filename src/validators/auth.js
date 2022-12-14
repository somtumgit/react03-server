const {check, validationResult} = require('express-validator');

exports.validateSignupRequest = [
    check('firstname')
    .notEmpty()
    .withMessage('First Name is required'),
    check('lastname')
    .notEmpty()
    .withMessage('Last Name is required'),
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 charactor')
];

exports.validateSigninRequest = [
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 charactor')
];

exports.isRequestValidated = function(req, res, next) {
    const errors = validationResult(req);
    // console.log(req.body);
    // console.log(errors);
    if(errors.array().length > 0) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}