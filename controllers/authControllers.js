const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
});

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync (async (req, res, next) => {
    const newUser = await User.create(req.body
        // name: req.body.name,
        // email: req.body.email,
        // role: req.body.role,
        // password: req.body.password,
        // passwordConfirm: req.body.passwordConfirm,
        // passwordChangedAt: req.body.passwordChangedAt,
    );
    createSendToken(newUser, 201, res);
    // const token = signToken(newUser._id);
    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // });
});

exports.login = catchAsync (async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email}).select('+password');
    if(!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    }
    createSendToken(user, 200, res)
    
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success'});
};

exports.protect = catchAsync (async (req, res, next) => {
    //Checking token if it's there or not
    let token;
    if(
       req.headers.authorization && 
       req.headers.authorization.startsWith('Bearer')
       )
    {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // console.log(token);
    if(!token) {
        return next(new AppError('You are not logged in, please login to access', 401));
    }
    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check if youser still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belongs to this token no longer exist', 401));
    }
    // Check the user changed his password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next (new AppError('User recently changed password, please log in again', 401))
    };
    // grant access to the protected route
    req.user = currentUser;
    next();
});

// Only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) { 
      // Verify token
      try {
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt, 
            process.env.JWT_SECRET
        );
        // Check if youser still exist
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return next();
        }
        // Check the user changed his password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next ();
        };
        // There is a logged in user
        res.locals.user = currentUser
        return next();
    } catch (err) {
        return next();
    }   
   }
   next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return next (new AppError('You do not have permission', 403))
    };
    next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user based on posted email
    const user = await User.findOne({ email: req.body.email  });
    if(!user) {
        return next(new AppError('There is no user with this email', 404));
    }
    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `forget your password? Submit a new password to this url: ${resetURL}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token valid for 10 mins',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
        
    } catch (error) {
        user.passwordResetToken = undefined;
        // eslint-disable-next-line no-unused-expressions
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next (new AppError('There was an error sending to email'), 500)
    }   
});
exports.resetPassword = catchAsync(async(req, res, next) => {
    // Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, 
                                      passwordResetExpires: { $gt: Date.now()}
    });


    // If token has not expired,  and there is user, set the new password
    if(!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    // Update ChangedPasswordAt property for user
    // Log the user in, send JWT
    createSendToken(user, 200, res)
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });

});
exports.updatePassword = catchAsync (async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401))
    }
    // if so update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in & send JWT
    createSendToken(user, 200, res)
});