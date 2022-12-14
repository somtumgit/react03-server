const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const { validationResult } = require('express-validator');

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
};

exports.signup = function(req, res, next) {
    User.findOne({
        email: req.body.email
    }).exec(async function(error, user) {
        if(user) {
            return res.status(400).json({
                message: 'User already registered!'
            });
        }

        const  {firstname,lastname,email,password} = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName: firstname,
            lastName: lastname,
            email: email,
            hash_password: hash_password,
            role: 'user',
            username: shortid.generate()
            // username: Math.random().toString()
        });
        newUser.save(function(error,user) {
            if(error) {
                return res.status(400).json({
                    message: 'Something went wrong!'
                });
            }
            if(user) {
                const token = generateJwtToken(user._id, user.role);
                const { _id, firstName, lastName, email, role, fullname } = user;
                return res.status(201).json({
                  token,
                  message: 'User added successfull!',
                  user: {_id, firstName, lastName, email, role, fullname}
                });
            }
        });
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
            if(match && user.role === 'user') {
                const token = jwt.sign({_id: user._id,role: user.role}, process.env.JWT_SECRET, { expiresIn : '1d' });
                const {_id, firstName, lastName, email, role, fullname} = user;
                res.status(200).json({
                    token: token,
                    user: {_id, firstName, lastName, email, role, fullname}
                });

            }else {
                return res.status(400).json({
                    error: 'Invalid Password!',
                });
            }
        }else {
            return res.status(400).json({
                message: 'Invalid Password!',
            });
        }

        
    });
}





