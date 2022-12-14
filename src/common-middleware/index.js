const jwt = require('jsonwebtoken');
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

exports.upload = multer({ storage });

exports.requireSignin = function(req, res, next) {
    // console.log(req.headers.authorization);
    if(req.headers.authorization) {
        const headers = req.headers.authorization;
        const token = headers.split(" ")[1];
        // console.log(token);
        jwt.verify(token, process.env.JWT_SECRET,function(err,user) {
            if(err) {
                return res.status(400).json({
                    message: "Authorization denied!"
                });
            }
            if(user) {
                req.user = user;
                next();
            }
        });
        
    }else {
        return res.status(400).json({
            message: "Authorization required!"
        });
    }

}

exports.userMiddleware = function(req, res, next) {
    if(req.user.role !== 'user') {
        return res.status(400).json({
            message: "User access denied!"
        });
    }
    next();
}

exports.adminMiddleware = function(req, res, next) {
    // console.log(req.user);
    if(req.user.role !== 'admin') {
        return res.status(400).json({
            message: "Admin access denied!"
        });
    }
    next();
}