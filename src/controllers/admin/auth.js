const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const { validationResult } = require('express-validator');

exports.signup = function(req, res, next) {
    // console.log(req.body);
    User.findOne({
        email: req.body.email
    }).exec(async function(error, user) {
        if(error) {
            return res.status(400).json({
                // message: 'Something went wrong!',
                error: error
            });
            
        }
        // console.log(user);
        if(user) {
            return res.status(400).json({
                // message: 'Admin already registered!',
                error: 'Admin already registered!'
            });
            
        }else {
            const  {firstname,lastname,email,password} = req.body;
            const hash_password = await bcrypt.hash(password, 10);
            const newUser = new User({
                firstName: firstname,
                lastName: lastname,
                email: email,
                hash_password: hash_password,
                role: 'admin',
                username: shortid.generate()
                // username: Math.random().toString()
            });
            newUser.save(async function(error,data) {
                if(error) {
                    return res.status(400).json({
                        // message: 'Something went wrong!',
                        error: error
                    });
                }
                if(data) {
                    return res.status(201).json({
                        message: 'User added successfull!',
                        user: data
                    });
                }
            });
        }

        
    });
}

exports.signin = function(req, res, next) {
    User.findOne({
        email: req.body.email
    }).exec(async function(error, user) {
        if(error) {
            return res.status(400).json({
                // message: 'Something went wrong!',
                error: error
            });
        }
        if(user) {
            const match = await user.authenticate(req.body.password);
            // console.log(match);
            if(match && user.role === 'admin') {
                const token = jwt.sign({_id: user._id,role: user.role}, process.env.JWT_SECRET, { expiresIn : '1d' });
                const {_id, firstName, lastName, email, role, fullname} = user;
                res.cookie('token', token, {expiresIn: '1h'});
                res.status(200).json({
                    token: token,
                    message: 'Sign in successfully!',
                    user: {_id, firstName, lastName, email, role, fullname}
                });

            }else {
                return res.status(400).json({
                    error: 'Invalid Password!',
                });
            }
        }else {
            return res.status(400).json({
                error: 'Invalid Password!',
            });
        }

        
    });
}

exports.signout = function(req, res, next) {
    res.clearCookie('token');
    res.status(200).json({
        message: "Signout successfully...!"
    });
}