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
});
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.createUser = factory.createOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
//Update user information except password
exports.updateUser = factory.updateOne(User); 
//Delete a user
exports.deleteUser = factory.deleteOne(User);
