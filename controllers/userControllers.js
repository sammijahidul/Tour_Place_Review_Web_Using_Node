const multer = require('multer');
const sharp = require('sharp');
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload an image', 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizePhoto = (req, res, next) => {
    if (!req.file) return next();
    
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
 
    sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/img/users/${req.file.filename}`);
    
    next();
};

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
    if (req.file) filteredBody.photo = req.file.filename;
    
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
