const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];

    })
    return newObj;
};
exports.getAllUsers = catchAsync (async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
   
});
exports.updateMe = catchAsync(async (req, res, next) => {
    
    // Create error if user posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password update. Use the correct route', 400))

    };
    // filtered out unwanted fields
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    // Update user document
    const UpdatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            UpdatedUser
        }

    })
});
exports.deleteMe = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})
    res.status(204).json({
        status: 'success',
        data: null
    })
})
exports.createUser = (req, res) => {
    console.log("Creating a user");
    res.status(200).json({
        status: 'success',
    })
};
exports.getOneUser = (req, res) => {
    console.log("Get one users");
    res.status(200).json({
        status: 'success',
    })
};
//Update user information except password
exports.updateUser = factory.updateOne(User); 
//Delete a user
exports.deleteUser = factory.deleteOne(User);
