const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
// const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');

exports.getAllTourData = factory.getAll(Tour);
exports.getOneTourData = factory.getOne(Tour, {path: 'reviews'});
exports.createATour = factory.createOne(Tour);
exports.updateATour = factory.updateOne(Tour);
exports.deleteATour = factory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};
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
// '/tours-within/:distance/center/:latlng/unit/:unit'
// /tours-within/233/center/34.07457922272319, -118.21221838448349/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if(!lat || !lng) {
        next(new AppError('please provie latitute longtitude in current format', 400));
    }
    const tours = await Tour.find({ 
               startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
               });
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data : {
            data: tours
        }
    })
});