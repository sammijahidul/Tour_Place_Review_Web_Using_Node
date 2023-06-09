const Tour = require('../models/tourModel');
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// All controllers/handlers related Tour

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}
exports.getAllTourData = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
                        .filter()
                        .sort()
                        .fieldslimit()
                        .paginate();
    const allTours = await features.query;
    // const allTours = await Tour.find();
    res.status(200).json({
        status: 'success',
        result: allTours.length,
        data: {
            allTours
        }
    })    
});
exports.getOneTourData = catchAsync(async (req, res, next) => {
        const getOneTour = await Tour.findById(req.params.id);
        if(!getOneTour) {
            return next(new AppError('Data with this id is not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                getOneTour
            }
        })        
});
exports.createATour = catchAsync( async (req, res, next) => {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'successful',
            data: {
                tour: newTour
            }
        })   
});
exports.updateATour = catchAsync(async (req, res, next) => {  
        const modifyATour = await Tour.findByIdAndUpdate(req.params.id, req.body, 
            {
                new: true,
                runValidators: true
            });
            if(!modifyATour) {
                return next(new AppError('Data with this id is not found', 404));
            }
        res.status(200).json({
            status: 'success',
            data: {
                modifyATour
            }
        })        
});
exports.deleteATour = catchAsync(async (req, res, next) => {    
        const deleteATour = await Tour.findByIdAndDelete(req.params.id);
        if(!deleteATour) {
            return next(new AppError('Data with this id is not found', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        })         
});
// Aggregation Pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: null,
                    numTours: { $sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'},
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })           
});
exports.getmonthlyplan = catchAsync(async (req, res, next) => {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1}
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })                  
});